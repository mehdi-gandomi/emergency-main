<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberPersonnel extends Model
{
    protected $table = 'member_personnel';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'member_id',
        'user_id',
        'personnel_id',
    ];

    public function personnel(): BelongsTo
    {
        return $this->belongsTo(Personnel::class, 'personnel_id', 'id');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }
}
