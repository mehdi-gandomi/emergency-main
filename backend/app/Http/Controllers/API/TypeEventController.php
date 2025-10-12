<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TypeEvent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Cache;
use App\Http\Resources\TypeEventResource;
class TypeEventController extends Controller
{
      /**
     * GET /api/type-events/tree
     * خروجی: آرایه‌ای از نودهای ریشه با فرزندان بازگشتی
     */
    public function tree(Request $request)
    {
        // کش ساده برای کاهش کوئری‌ها (در صورت نیاز TTL را تغییر دهید)
        $ttl = 60; // ثانیه
        $tree = Cache::remember('type_events_tree', $ttl, function () {
            return TypeEvent::roots()
                ->with('childrenRecursive')
                ->orderBy('id')
                ->get();
        });

        return TypeEventResource::collection($tree);
    }
    /**
     * Display a listing of type events for incident forms
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = TypeEvent::query();
            
            
            
            // Filter by parent type if specified
            if ($request->has('parent_id')) {
                $query->where('type_event_id', $request->parent_id);
            }
            
            $typeEvents = $query->orderBy('title')->get();
            
            // Transform the data to include icon URL
            $transformedEvents = $typeEvents->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'en_title' => $event->en_title,
                    'ar_title' => $event->ar_title,
                    'icon_path' => $event->icon_path ? "/icon/{$event->icon_path}.png" : null,
                    'coding' => $event->coding,
                    'has_children' => $event->children()->count() > 0
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedEvents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch type events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get subcategories of a type event
     */
    public function subcategories(Request $request, $id): JsonResponse
    {
        try {
            $subcategories = TypeEvent::where('type_event_id', $id)
                ->where('display_registration_form', 1)
                ->where('state', 1)
                ->orderBy('title')
                ->get();
            
            $transformedSubcategories = $subcategories->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'en_title' => $event->en_title,
                    'ar_title' => $event->ar_title,
                    'icon_path' => $event->icon_path ? "/icon/{$event->icon_path}" : null,
                    'coding' => $event->coding
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => $transformedSubcategories
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch subcategories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
