<?php

namespace Fof\FriendLinks;

use Flarum\Extend;
use Fof\FriendLinks\Api\Controller;
use Fof\FriendLinks\Console\PurgeCommand;
use Fof\FriendLinks\Event\FriendLinkStatusChanged;
use Illuminate\Contracts\Events\Dispatcher;

return [
    // Register frontend
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less')
        ->route('/friend-links', 'fof-friend-links.list'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    new Extend\Locales(__DIR__.'/locale'),

    // Add settings to forum payload (using standard flarum settings for frontend variables)
    (new Extend\Settings())
        ->serializeToForum('fofFriendLinksMaxItems', 'fof-friend-links.max_items', 'intval', 10)
        ->serializeToForum('fofFriendLinksSiteName', 'fof-friend-links.site_name', 'strval')
        ->serializeToForum('fofFriendLinksSiteUrl', 'fof-friend-links.site_url', 'strval')
        ->serializeToForum('fofFriendLinksSiteLogo', 'fof-friend-links.site_logo', 'strval'),

    // Routes
    (new Extend\Routes('api'))
        ->post('/friend-links', 'fof-friend-links.create', Controller\CreateFriendLinkController::class)
        ->get('/friend-links', 'fof-friend-links.index', Controller\ListFriendLinksController::class)
        ->patch('/friend-links/{id}', 'fof-friend-links.update', Controller\UpdateFriendLinkController::class)
        ->delete('/friend-links/{id}', 'fof-friend-links.delete', Controller\DeleteFriendLinkController::class)
        ->get('/friend-links/settings', 'fof-friend-links.settings.get', Controller\GetSettingsController::class)
        ->put('/friend-links/settings', 'fof-friend-links.settings.update', Controller\UpdateSettingsController::class),

    // CLI
    (new Extend\Console())
        ->command(PurgeCommand::class),
        
    // Event Listeners for Emails
    (new Extend\Event())
        ->listen(FriendLinkStatusChanged::class, \Fof\FriendLinks\Mail\SendNotificationEmail::class),

    // Expose email to admin users in the friend-links API response
    (new Extend\ApiSerializer(\Flarum\Api\Serializer\UserSerializer::class))
        ->attribute('email', function ($serializer, $user, $attributes) {
            if ($serializer->getActor()->isAdmin()) {
                return $user->email;
            }
        }),
];
