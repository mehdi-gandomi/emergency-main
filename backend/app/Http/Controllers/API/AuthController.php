<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use App\Models\LogoutEvent;
class AuthController extends Controller
{
    public function verifyPersonnel(Request $request)
    {
        $validated = $request->validate([
            'national_code' => 'required|string|size:10',
        ]);

        // First try to call the external API
        $client = new \GuzzleHttp\Client();
        $apiKey = '0b337280538c31061cab9ced9004832a2a3358bf';
        $persianDate = verta()->format("Y/m/d"); // Using jdate if available, or you can use a fixed date
        
        try {
            $response = $client->request('POST', 'https://raromis.ir/superapp/emis/check-personnel', [
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                        'verify' => false, // Disable SSL verification
                'json' => [
                    'api_key' => $apiKey,
                    'date' => $persianDate,
                    'national_code' => $validated['national_code']
                ]
            ]);
            
            $apiResponse = json_decode($response->getBody()->getContents(), true);
            
            // Check if API response is valid and contains personnel data
            if (count($apiResponse) && isset($apiResponse[0])) {
                $personnelData = $apiResponse[0];
                $roleStatus = isset($personnelData['state']) ? $personnelData['state']:null; // 1 for admin, 2 for operator
                
                return response()->json([
                    'status' => $roleStatus,
                    'role' => $roleStatus == 1 ? 'admin' : 'operator',
                    'id' => $personnelData['personnel_id'],
                    'name' => $personnelData['name'],
                    'family' => $personnelData['family'],
                    'shift' => isset($personnelData['shift']) ? $personnelData['shift']:null,
                    'date' => isset($personnelData['date']) ? $personnelData['date']:null,
                    'time_start' => isset($personnelData['time_s']) ? $personnelData['time_s']:null,
                    'time_end' => isset($personnelData['time_e']) ? $personnelData['time_e']:null,
                    'post' => isset($personnelData['post']) ? $personnelData['post']:null,
                    'center' => isset($personnelData['operational_centers_title']) ? $personnelData['operational_centers_title']:null,
                    'province' => isset($personnelData['province_title']) ? $personnelData['province_title']:null
                ], 200);
            }else{
                return response()->json([
                    'status' => 0,
                    'message' => 'کد ملی یافت نشد.'
                ], 200);
            }
        } catch (\Exception $e) {
            dd($e);
            \Log::error('External API error: ' . $e->getMessage());
            // Fall back to local database if API fails
        }
        
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'in:operator,admin',
            'extension' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'operator',
            'extension' => $validated['extension'] ?? null,
        ]);

        return response()->json($user, 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'national_code' => 'required|string|size:10',
            'password' => 'required|string',
            'personnelDetails'=>'required'
        ]);

        // Find personnel by national code and ID
        $personnel = \App\Models\Personnel::where('national_code', $validated['national_code'])
            ->first();

        if (!$personnel) {
            
            return response()->json([
            'status'=>'error',
                'message'=>'کد ملی یافت نشد.'
            ]);
        }

        // Find user associated with this personnel
        $user = User::with("personnel")->where('personnel_id', $personnel->id)->first();

      if(!$user){
            
            return response()->json([
            'status'=>'error',
                'message'=>'نام کاربری یا رمز عبور یافت نشد'
            ]);
      }

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
          
            return response()->json([
            'status'=>'error',
                'message'=>'رمز عبور اشتباه است.'
            ]);
        }

        // Laravel Sanctum: issue token for API use
        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'status'=>'success',
            'data'=>[
                'token' => $token,
                'user' => $user->load("personnel")
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $validated = $request->validate([
            'reason' => 'nullable|string',
            'description' => 'nullable|string',
            'duration' => 'nullable|integer',
            'supervisorApproval' => 'nullable|boolean',
            'smsSent' => 'nullable|boolean',
        ]);

        if (!empty($validated)) {
            LogoutEvent::create([
                'personnel_id' => $request->user()->personnel_id,
                'reason' => $validated['reason'] ?? null,
                'description' => $validated['description'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'supervisor_approval' => $validated['supervisorApproval'] ?? false,
                'sms_sent' => $validated['smsSent'] ?? false,
            ]);
        }

        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}


