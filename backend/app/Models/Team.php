<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class Team
 *
 * @package App\Models
 *
 * @property int $id
 * @property string $title عنوان تیم
 * @property bool $state وضعیت (فعال یا غیرفعال)
 */
class Team extends Model
{
    use HasFactory;

    /**
     * جدول مرتبط با این مدل
     *
     * @var string
     */
    protected $table = 'team';

    /**
     * کلید اصلی جدول
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * نوع کلید اصلی
     *
     * @var string
     */
    protected $keyType = 'int';

    /**
     * غیرفعال کردن timestamps (چون در جدول وجود ندارد)
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * فیلدهای قابل مقداردهی انبوه
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'state',
    ];

    /**
     * نوع داده فیلدها
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'state' => 'boolean',
    ];

    /**
     * اسکوپ برای فیلتر تیم‌های فعال
     */
    public function scopeActive($query)
    {
        return $query->where('state', 1);
    }

    public function contacts(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, 'contact_teams', 'team_id', 'contact_id')
            ->withPivot('count');
    }
}
