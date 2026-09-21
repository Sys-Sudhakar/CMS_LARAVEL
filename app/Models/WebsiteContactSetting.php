<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WebsiteContactSetting extends Model
{
    protected $fillable = [
        'website_id',
        'widget_enabled',
        'phone_display',
        'phone_link',
        'whatsapp',
        'email',
    ];

    protected $casts = [
        'widget_enabled' => 'boolean',
    ];

    public function website(): BelongsTo
    {
        return $this->belongsTo(Website::class);
    }
}