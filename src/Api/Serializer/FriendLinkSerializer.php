<?php

namespace Fof\FriendLinks\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Fof\FriendLinks\Model\FriendLink;
use Flarum\Api\Serializer\UserSerializer;

class FriendLinkSerializer extends AbstractSerializer
{
    protected $type = 'friend-links';

    protected function getDefaultAttributes($link)
    {
        return [
            'site_name'    => $link->site_name,
            'site_url'     => $link->site_url,
            'logo_url'     => $link->logo_url,
            'status'       => $link->status,
            'reject_reason'=> $link->reject_reason,
            'createdAt'    => $this->formatDate($link->created_at),
            'approvedAt'   => $this->formatDate($link->approved_at),
        ];
    }

    protected function user($link)
    {
        return $this->hasOne($link, UserSerializer::class);
    }
}
