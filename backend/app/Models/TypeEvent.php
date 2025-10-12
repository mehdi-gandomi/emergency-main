<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TypeEvent extends Model
{
    protected $table = 'type_events';
    public $timestamps = false;
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'title',
        'en_title',
        'ar_title',
        'type_event_id',
        'coding',
        'type_event_id_rep',
        'report_criteria',
        'equivalent',
        'icon_path',
        'show_map',
        'display_registration_form',
        'show_app',
        'state',
    ];

    protected $casts = [
        'type_event_id'               => 'integer',
        'type_event_id_rep'           => 'integer',
        'report_criteria'             => 'integer',
        'equivalent'                  => 'integer',
        'show_map'                    => 'integer',
        'display_registration_form'   => 'integer',
        'show_app'                    => 'integer',
        'state'                       => 'integer',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(TypeEvent::class, 'type_event_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(TypeEvent::class, 'type_event_id');
    }

    // بارگذاری بازگشتی فرزندان
    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    // نودهای ریشه (type_event_id = 0)
    public function scopeRoots($query)
    {
        return $query->where('type_event_id', 0);
    }
}
