<?php

namespace App\Http\Controllers\Auth;

use App\Enums\LogoutReasonEnum;
use App\Http\Controllers\Controller;
use App\Models\LogoutEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    /**
     * Log the user out and record the logout event
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->validate([
            'reason' => 'required|string',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer',
            'supervisorApproval' => 'nullable|boolean',
            'smsSent' => 'nullable|boolean',
        ]);

        // Create logout event record
        LogoutEvent::create([
            'personnel_id' => Auth::id(),
            'reason' => $request->reason,
            'date' => now(),
            'description' => $request->description,
            'alarm_status' => false, // Default value, can be updated based on requirements
            'duration' => $request->duration,
            'supervisor_approval' => $request->supervisorApproval ?? false,
            'sms_sent' => $request->smsSent ?? false,
        ]);

        // Revoke the user's token
        if ($request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'message' => 'Logged out successfully',
            'status' => 'success'
        ]);
    }
}