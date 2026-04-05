<?php

namespace Fof\FriendLinks\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Psr\Http\Message\ServerRequestInterface;
use Fof\FriendLinks\Model\FriendLink;
use Illuminate\Support\Arr;

class DeleteFriendLinkController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $request->getAttribute('actor')->assertAdmin();

        $id = Arr::get($request->getQueryParams(), 'id');
        $link = FriendLink::findOrFail($id);

        $link->delete();
    }
}
