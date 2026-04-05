<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('friend_links')) {
            $schema->create('friend_links', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('user_id')->unsigned()->nullable();
                $table->string('site_name', 30);
                $table->string('site_url');
                $table->string('logo_url');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->text('reject_reason')->nullable();
                $table->timestamps();
                $table->timestamp('approved_at')->nullable();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            });
        }

        if (!$schema->hasTable('friend_link_settings')) {
            $schema->create('friend_link_settings', function (Blueprint $table) {
                $table->string('key')->primary();
                $table->text('value')->nullable();
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('friend_links');
        $schema->dropIfExists('friend_link_settings');
    }
];
