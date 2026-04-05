<?php

namespace Fof\FriendLinks\Api\Controller;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Flarum\Settings\SettingsRepositoryInterface;

class GetSettingsController implements RequestHandlerInterface
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $request->getAttribute('actor')->assertAdmin();

        $keys = [
            'fof-friend-links.max_items',
            'fof-friend-links.notice_text',
            'fof-friend-links.page_title',
            'fof-friend-links.page_desc',
            'fof-friend-links.mail_approved',
            'fof-friend-links.mail_rejected',
            'fof-friend-links.mail_new',
        ];

        $data = [];
        foreach ($keys as $key) {
            $data[$key] = $this->settings->get($key, '');
        }

        return new JsonResponse(['data' => ['attributes' => $data]]);
    }
}
