<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LandingPage extends Model
{
    protected $fillable = [
        'product_id',
        'title',
        'slug',
        'subtitle',
        'hero_text',
        'badge_text',
        'phone',
        'use_cases',
        'use_cases_title',
        'features',
        'features_title',
        'specifications',
        'specifications_title',
        'why_buy',
        'why_buy_title',
        'checkout_banner_text',
        'footer_text',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'use_cases' => 'array',
            'features' => 'array',
            'specifications' => 'array',
            'why_buy' => 'array',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
