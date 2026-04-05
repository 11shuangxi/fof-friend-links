<?php

namespace Fof\FriendLinks\Console;

use Illuminate\Console\Command;
use Illuminate\Database\Schema\Builder;
use Flarum\Settings\SettingsRepositoryInterface;

class PurgeCommand extends Command
{
    protected $signature = 'friend-links:purge';
    protected $description = 'Purge all friend links data from the database';

    public function handle(Builder $schema, SettingsRepositoryInterface $settings)
    {
        $this->info('Purging friend links data...');

        $schema->dropIfExists('friend_links');
        $schema->dropIfExists('friend_link_settings');

        // Clean settings
        $settings->delete('fof-friend-links.max_items');
        $settings->delete('fof-friend-links.notice_text');
        $settings->delete('fof-friend-links.page_title');
        $settings->delete('fof-friend-links.page_desc');
        $settings->delete('fof-friend-links.mail_approved');
        $settings->delete('fof-friend-links.mail_rejected');
        $settings->delete('fof-friend-links.mail_new');

        $this->info('Data purged successfully.');
    }
}
