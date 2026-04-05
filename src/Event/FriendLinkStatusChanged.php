<?php

namespace Fof\FriendLinks\Event;

use Fof\FriendLinks\Model\FriendLink;
use Flarum\User\User;

class FriendLinkStatusChanged
{
    public $link;
    public $actor;
    public $oldStatus;

    public function __construct(FriendLink $link, User $actor = null, $oldStatus = null)
    {
        $this->link = $link;
        $this->actor = $actor;
        $this->oldStatus = $oldStatus;
    }
}
