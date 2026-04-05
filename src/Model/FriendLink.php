<?php

namespace Fof\FriendLinks\Model;

use Flarum\Database\AbstractModel;
use Flarum\User\User;

class FriendLink extends AbstractModel
{
    protected $table = 'friend_links';

    protected $dates = ['created_at', 'updated_at', 'approved_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
