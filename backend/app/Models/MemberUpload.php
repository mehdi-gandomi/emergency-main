<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberUpload extends Model
{
    protected $table = 'member_upload';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'member_id',
        'type',
        'file',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id', 'id');
    }
}
