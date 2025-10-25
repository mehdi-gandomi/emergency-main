<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Mission;
use App\Models\SendDispatchNotificationMission;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SendDispatchNotificationMissionController extends Controller
{
    /**
     * Send dispatch mission notifications to selected personnel
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function sendDispatchNotification(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'events_id' => 'required|exists:events,id',
            'initial_report_id' => 'nullable|integer',
            'personnel' => 'required|array',
            'personnel.*' => 'exists:personnel,id',
            'operational_centers_id' => 'required|integer',
            'province_id_user' => 'required|integer',
            'personnel_id_user' => 'required|integer',
            'comm' => 'nullable|string',
            'IMEI' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Start transaction
            DB::beginTransaction();
            
            // Get event details
            $event = Event::findOrFail($request->events_id);
            
            // Current time for dispatch
            $currentTime = Carbon::now();
            
            // Create notifications for each personnel
            $notificationCount = 0;
            foreach ($request->personnel as $personnelId) {
                $notification = new SendDispatchNotificationMission();
                $notification->province_id_user = $request->province_id_user;
                $notification->personnel_id_user = $request->personnel_id_user;
                $notification->personnel_id = $personnelId;
                $notification->operational_centers_id = $request->operational_centers_id;
                $notification->IMEI = $request->IMEI ?? null;
                $notification->events_id = $request->events_id;
                $notification->initial_report_id = $request->initial_report_id ?? null;
                $notification->time_send = $currentTime;
                $notification->comm = $request->comm ?? 'اعزام به مأموریت';
                $notification->state = 0; // 0 = ارسال شده
                $notification->save();
                
                // TODO: Send push notification if needed
                
                $notificationCount++;
            }
            
            // Commit transaction
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'اعلان‌های اعزام با موفقیت ارسال شدند',
                'data' => [
                    'notification_count' => $notificationCount,
                    'event_id' => $event->id
                ]
            ], 200);
            
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'خطا در ارسال اعلان‌های اعزام',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get dispatch status for an event
     *
     * @param  int  $eventId
     * @return \Illuminate\Http\Response
     */
    public function getDispatchStatus($eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            
            $notifications = SendDispatchNotificationMission::where('events_id', $eventId)
                ->with(['dispatchedPersonnel:id,name', 'senderPersonnel:id,name'])
                ->get();
                
            $stats = [
                'total' => $notifications->count(),
                'accepted' => $notifications->where('state', 1)->count(),
                'rejected' => $notifications->where('state', 4)->count(),
                'pending' => $notifications->where('state', 0)->count(),
                'seen' => $notifications->where('state', 2)->count(),
                'not_seen' => $notifications->where('state', 3)->count(),
            ];
            
            return response()->json([
                'success' => true,
                'data' => [
                    'event' => $event,
                    'notifications' => $notifications,
                    'stats' => $stats
                ]
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در دریافت وضعیت اعزام',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Update notification status (for mobile app)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateNotificationStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'notification_id' => 'required|exists:send_dispatch_notification_mission,id',
            'state' => 'required|integer|in:1,2,3,4', // 1=تأیید، 2=مشاهده، 3=عدم مشاهده، 4=عدم تأیید
            'time_seen' => 'nullable|date',
            'time_confirmation' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطای اعتبارسنجی',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $notification = SendDispatchNotificationMission::findOrFail($request->notification_id);
            
            // Update notification status
            $notification->state = $request->state;
            
            // Update timestamps based on status
            if ($request->state == 2 || $request->state == 3) { // Seen or not seen
                $notification->time_seen = $request->time_seen ?? Carbon::now();
            }
            
            if ($request->state == 1 || $request->state == 4) { // Accepted or rejected
                $notification->time_confirmation = $request->time_confirmation ?? Carbon::now();
            }
            
            $notification->save();
            
            return response()->json([
                'success' => true,
                'message' => 'وضعیت اعلان با موفقیت به‌روزرسانی شد',
                'data' => $notification
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطا در به‌روزرسانی وضعیت اعلان',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
