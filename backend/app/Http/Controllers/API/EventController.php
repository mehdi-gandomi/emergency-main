<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EventController extends Controller
{
    /**
     * GET /api/events
     * فیلترهای پشتیبانی‌شده از طریق Query String:
     * - type_event_id (int)
     * - base_type, level, operation_status, province_id, branches_id, archived (int)
     * - from, to (int - یونیکس، روی ستون times_accident)
     * - q (string - جستجو در شرح/مکان)
     * - min_lat, max_lat, min_lon, max_lon (float) - فیلتر جعبه جغرافیایی
     * - sort_by (ستون مجاز)، sort_dir (asc|desc)
     * - per_page (پیش‌فرض 20)
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'type_event_id' => 'nullable|integer',
            'base_type' => 'nullable|integer',
            'level' => 'nullable|integer',
            'operation_status' => 'nullable|integer',
            'province_id' => 'nullable|integer',
            'branches_id' => 'nullable|integer',
            'archived' => 'nullable|in:0,1',
            'from' => 'nullable|integer',
            'to' => 'nullable|integer',
            'q' => 'nullable|string|max:200',
            'min_lat' => 'nullable|numeric',
            'max_lat' => 'nullable|numeric',
            'min_lon' => 'nullable|numeric',
            'max_lon' => 'nullable|numeric',
            'sort_by' => [
                'nullable',
                Rule::in([
                    'id','times_accident','level','operation_status','province_id','type_event_id','created_at'
                ])
            ],
            'sort_dir' => 'nullable|in:asc,desc',
            'per_page' => 'nullable|integer|min:1|max:200',
        ]);

        $sortBy = $validated['sort_by'] ?? 'times_accident';
        $sortDir = $validated['sort_dir'] ?? 'desc';
        $perPage = $validated['per_page'] ?? 20;

        $query = Event::query()
            ->typeEvent($validated['type_event_id'] ?? null)
            ->when($validated['base_type'] ?? null, fn($q,$v)=>$q->where('base_type', $v))
            ->when($validated['level'] ?? null, fn($q,$v)=>$q->where('level', $v))
            ->when($validated['operation_status'] ?? null, fn($q,$v)=>$q->where('operation_status', $v))
            ->when($validated['province_id'] ?? null, fn($q,$v)=>$q->where('province_id', $v))
            ->when($validated['branches_id'] ?? null, fn($q,$v)=>$q->where('branches_id', $v))
            ->when(isset($validated['archived']), fn($q)=>$q->where('archived', $validated['archived']))
            ->betweenUnix($validated['from'] ?? null, $validated['to'] ?? null, 'times_accident')
            ->search($validated['q'] ?? null)
            ->geoBox(
                $validated['min_lat'] ?? null,
                $validated['max_lat'] ?? null,
                $validated['min_lon'] ?? null,
                $validated['max_lon'] ?? null
            );

        // جلوگیری از sort بر ستون‌های نامعتبر
        if (!in_array($sortBy, ['id','times_accident','level','operation_status','province_id','type_event_id'])) {
            $sortBy = 'times_accident';
        }

        $events = $query->orderBy($sortBy, $sortDir)->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $events->items(),
            'meta' => [
                'current_page' => $events->currentPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }
}
