<?php

namespace Fof\FriendLinks\Api\Controller;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Laminas\Diactoros\Response\JsonResponse;
use Illuminate\Support\Arr;
use Flarum\Settings\SettingsRepositoryInterface;

class UpdateSettingsController implements RequestHandlerInterface
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $request->getAttribute('actor')->assertAdmin();
        $attributes = Arr::get($request->getParsedBody(), 'data.attributes', []);

        foreach ($attributes as $key => $value) {
            if (strpos($key, 'fof-friend-links.') === 0) {
                $this->settings->set($key, $value);
            }
        }

        return new JsonResponse(['data' => ['attributes' => $attributes]]);
    }
}
