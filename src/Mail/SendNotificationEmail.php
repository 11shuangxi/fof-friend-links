<?php

namespace Fof\FriendLinks\Mail;

use Fof\FriendLinks\Event\FriendLinkStatusChanged;
use Illuminate\Contracts\Mail\Mailer;
use Illuminate\Mail\Message;
use Flarum\Settings\SettingsRepositoryInterface;
use Symfony\Contracts\Translation\TranslatorInterface;
use Flarum\User\User;

class SendNotificationEmail
{
    protected $mailer;
    protected $settings;
    protected $translator;

    public function __construct(Mailer $mailer, SettingsRepositoryInterface $settings, TranslatorInterface $translator)
    {
        $this->mailer = $mailer;
        $this->settings = $settings;
        $this->translator = $translator;
    }

    public function handle(FriendLinkStatusChanged $event)
    {
        $enabled = $this->settings->get('fof-friend-links.enable_mail_notifications', false);
        if (!$enabled) {
            return;
        }

        $link = $event->link;
        $user = $link->user;

        // If newly created (status is pending, oldStatus is null), send to admin
        if ($link->status === 'pending' && $event->oldStatus === null) {
            $this->sendToAdmins($link);
        } elseif ($link->status === 'approved' && $event->oldStatus !== 'approved') {
            $this->sendToUser($user, $link, 'fof-friend-links.mail_approved', 'Your friend link has been approved!', "用户名称：{\$username}\n您申请的网站名称：{\$siteName}\n您申请提交的链接：{\$siteUrl}\n已通过审核。");
        } elseif ($link->status === 'rejected' && $event->oldStatus !== 'rejected') {
            $this->sendToUser($user, $link, 'fof-friend-links.mail_rejected', 'Your friend link has been rejected.', "用户名称：{\$username}\n您申请的网站名称：{\$siteName}\n您申请提交的链接：{\$siteUrl}\n未通过审核，拒绝理由：{\$reason}");
        }
    }

    protected function sendToAdmins($link)
    {
        $admins = User::whereHas('groups', function ($query) {
            $query->where('id', 1); // Admin group ID is 1
        })->get();

        $template = $this->settings->get('fof-friend-links.mail_new');
        if (!$template) {
            $template = "新友情链接申请:\n申请人邮箱: {\$userEmail}\n网站名称: {\$siteName}\n网站地址: {\$siteUrl}";
        }

        $body = $this->replaceVariables($template, $link);

        foreach ($admins as $admin) {
            $this->mailer->raw($body, function (Message $message) use ($admin) {
                $message->to($admin->email);
                $message->subject('New Friend Link Application');
            });
        }
    }

    protected function sendToUser($user, $link, $settingKey, $defaultSubject, $defaultTemplate = null)
    {
        if (!$user || !$user->email) return;

        $template = $this->settings->get($settingKey);
        if (!$template) {
            $template = $defaultTemplate ?: "Status of your friend link application for {\$siteName} has been updated.\nReason: {\$reason}";
        }

        $body = $this->replaceVariables($template, $link);

        $this->mailer->raw($body, function (Message $message) use ($user, $defaultSubject) {
            $message->to($user->email);
            $message->subject($defaultSubject);
        });
    }

    protected function replaceVariables($template, $link)
    {
        $user = $link->user;
        $username = $user ? $user->username : 'Guest';
        $userEmail = $user ? $user->email : 'Unknown';

        $vars = [
            '{$username}'  => $username,
            '{$userEmail}' => $userEmail,
            '{$siteName}'  => $link->site_name,
            '{$siteUrl}'   => $link->site_url,
            '{$logoUrl}'   => $link->logo_url,
            '{$reason}'    => $link->reject_reason ?: '',
            '{$baseUrl}'   => app('flarum.config')['url'],
        ];

        return str_replace(array_keys($vars), array_values($vars), $template);
    }
}
