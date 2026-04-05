<?php

namespace Fof\FriendLinks\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Fof\FriendLinks\Model\FriendLink;
use Fof\FriendLinks\Api\Serializer\FriendLinkSerializer;
use Illuminate\Support\Arr;
use Fof\FriendLinks\Event\FriendLinkStatusChanged;
use Illuminate\Contracts\Events\Dispatcher;

class UpdateFriendLinkController extends AbstractShowController
{
    public $serializer = FriendLinkSerializer::class;

    protected $events;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $actor->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');
        $link = FriendLink::findOrFail($id);
        $oldStatus = $link->status;

        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        if (isset($attributes['site_name'])) {
            $link->site_name = $attributes['site_name'];
        }
        if (isset($attributes['site_url'])) {
            $link->site_url = $attributes['site_url'];
        }
        if (isset($attributes['logo_url'])) {
            $link->logo_url = $attributes['logo_url'];
        }

        if (isset($attributes['status']) && in_array($attributes['status'], ['pending', 'approved', 'rejected'])) {
            $link->status = $attributes['status'];
            if ($link->status === 'approved' && $oldStatus !== 'approved') {
                $link->approved_at = \Carbon\Carbon::now();
            }
        }

        if (isset($attributes['reject_reason'])) {
            $link->reject_reason = $attributes['reject_reason'];
        }

        $link->save();

        if ($oldStatus !== $link->status) {
            $this->events->dispatch(new FriendLinkStatusChanged($link, $actor, $oldStatus));
            
            // If the status is changed to rejected, we delete the link entirely after sending the email
            if ($link->status === 'rejected') {
                $link->delete();
            }
        }

        return $link;
    }
}
