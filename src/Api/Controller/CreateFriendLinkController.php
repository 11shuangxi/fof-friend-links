<?php

namespace Fof\FriendLinks\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Fof\FriendLinks\Model\FriendLink;
use Fof\FriendLinks\Api\Serializer\FriendLinkSerializer;
use Illuminate\Support\Arr;
use Flarum\Foundation\ValidationException;
use Fof\FriendLinks\Event\FriendLinkStatusChanged;
use Illuminate\Contracts\Events\Dispatcher;

class CreateFriendLinkController extends AbstractCreateController
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
        $actor->assertRegistered();

        // Basic rate limit: 10 per hour.
        $recentCount = FriendLink::where('user_id', $actor->id)
            ->where('created_at', '>=', \Carbon\Carbon::now()->subHour())
            ->count();
        
        if ($recentCount >= 10 && !$actor->isAdmin()) {
            throw new ValidationException(['rate_limit' => 'You have reached the submission limit (10 per hour).']);
        }

        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        if (empty($attributes['site_name']) || mb_strlen($attributes['site_name']) > 30) {
            throw new ValidationException(['site_name' => 'Site name is required and max 30 characters.']);
        }

        if (empty($attributes['site_url']) || !preg_match('/^https?:\/\//i', $attributes['site_url'])) {
            throw new ValidationException(['site_url' => 'Site URL must start with http or https.']);
        }

        if (empty($attributes['logo_url']) || !preg_match('/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp|svg)$/i', $attributes['logo_url'])) {
            throw new ValidationException(['logo_url' => 'Logo URL must be a valid image URL.']);
        }

        $link = new FriendLink();
        $link->user_id = $actor->id;
        $link->site_name = $attributes['site_name'];
        $link->site_url = $attributes['site_url'];
        $link->logo_url = $attributes['logo_url'];
        
        $link->status = 'pending';
        if ($actor->isAdmin() && isset($attributes['status']) && in_array($attributes['status'], ['pending', 'approved', 'rejected'])) {
            $link->status = $attributes['status'];
            if ($link->status === 'approved') {
                $link->approved_at = \Carbon\Carbon::now();
            }
        }
        
        $link->save();

        // Dispatch event for admin notification
        $this->events->dispatch(new FriendLinkStatusChanged($link, $actor, null));

        return $link;
    }
}
