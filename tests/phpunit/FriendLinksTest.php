<?php

namespace Fof\FriendLinks\Tests;

use Flarum\Testing\integration\TestCase;
use Fof\FriendLinks\Model\FriendLink;

class FriendLinksTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->extension('fof-friend-links');
    }

    public function test_can_create_friend_link()
    {
        $response = $this->send(
            $this->request('POST', '/api/friend-links', [
                'authenticatedAs' => 1,
            ])->withParsedBody([
                'data' => [
                    'attributes' => [
                        'site_name' => 'My Site',
                        'site_url' => 'https://mysite.com',
                        'logo_url' => 'https://mysite.com/logo.png',
                    ],
                ],
            ])
        );

        $this->assertEquals(201, $response->getStatusCode());
        
        $body = json_decode($response->getBody()->getContents(), true);
        $this->assertEquals('My Site', $body['data']['attributes']['site_name']);
        $this->assertEquals('pending', $body['data']['attributes']['status']);
    }

    public function test_cannot_create_invalid_url()
    {
        $response = $this->send(
            $this->request('POST', '/api/friend-links', [
                'authenticatedAs' => 1,
            ])->withParsedBody([
                'data' => [
                    'attributes' => [
                        'site_name' => 'My Site',
                        'site_url' => 'invalid-url',
                        'logo_url' => 'https://mysite.com/logo.png',
                    ],
                ],
            ])
        );

        $this->assertEquals(422, $response->getStatusCode());
    }
}
