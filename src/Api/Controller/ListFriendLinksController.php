<?php

namespace Fof\FriendLinks\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Fof\FriendLinks\Model\FriendLink;
use Fof\FriendLinks\Api\Serializer\FriendLinkSerializer;
use Illuminate\Support\Arr;

class ListFriendLinksController extends AbstractListController
{
    public $serializer = FriendLinkSerializer::class;
    public $include = ['user'];
    
    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }
    
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);

        $query = FriendLink::query();
        
        if ($actor->isAdmin()) {
            // Admins can see all statuses and can sort
            $sort = $this->extractSort($request);
            if ($sort) {
                foreach ($sort as $field => $order) {
                    $query->orderBy($field, $order);
                }
            } else {
                $query->orderBy('created_at', 'desc');
            }
        } else {
            // Normal users only see approved
            $query->where('status', 'approved')
                  ->orderBy('approved_at', 'desc');
        }

        $total = $query->count();
        $links = $query->skip($offset)->take($limit)->get();
        
        // Use Flarum's built-in UrlGenerator dependency to build pagination links
        $document->addPaginationLinks(
            $this->url->to('api')->route('fof-friend-links.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $total === $limit ? null : 0
        );

        return $links;
    }
}
