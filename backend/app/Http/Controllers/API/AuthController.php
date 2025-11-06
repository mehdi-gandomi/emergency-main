<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Personnel;
use App\Models\ProvinceExtension;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use App\Models\LogoutEvent;
use App\Models\LoginLog;
use Carbon\Carbon;
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

                // Resolve province via local DB (personnel -> city -> province)
                $provinceId = null;
                $provinceExtensions = null;
                try {
                    $personnelId = $personnelData['personnel_id'] ?? null;
                    if ($personnelId) {
                        $personnel = Personnel::with(['city'])->find($personnelId);
                        if ($personnel && $personnel->city) {
                            $provinceId = $personnel->city->province_id;
                        }
                        if ($provinceId) {
                            $ext = ProvinceExtension::where('province_id', $provinceId)->first();
                            if ($ext) {
                                $provinceExtensions = $ext->extensions;
                            }
                        }
                    }
                } catch (\Throwable $t) {
                    // swallow and proceed without extensions
                }

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
                    'province' => isset($personnelData['province_title']) ? $personnelData['province_title']:null,
                    'province_id' => $provinceId,
                    'extensions' => $provinceExtensions,
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

        // Prevent multiple concurrent logins: if there's a successful login today with no logout after it, block login
        try {
            $latestLogin = LoginLog::where('personnel_id', $personnel->id)
                ->where('success', true)
                ->whereDate('created_at', Carbon::today())
                ->latest('created_at')
                ->first();
            if ($latestLogin) {
                $hasLogoutAfter = LogoutEvent::where('personnel_id', $personnel->id)
                    ->where('created_at', '>=', $latestLogin->created_at)
                    ->exists();
                if (!$hasLogoutAfter) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'امکان ورود وجود ندارد؛ اپراتور قبلاً وارد سیستم شده و هنوز خارج نشده است.'
                    ]);
                }
            }

            // Prevent concurrent login by extension: if same extension is active today without logout, block
            $ext = data_get($validated, 'personnelDetails.extension');
            if (!empty($ext)) {
                $latestExtLogin = LoginLog::where('extension', $ext)
                    ->where('success', true)
                    ->whereDate('created_at', Carbon::today())
                    ->latest('created_at')
                    ->first();
                if ($latestExtLogin) {
                    $hasExtLogoutAfter = LogoutEvent::where('personnel_id', $latestExtLogin->personnel_id)
                        ->where('created_at', '>=', $latestExtLogin->created_at)
                        ->exists();
                    if (!$hasExtLogoutAfter) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'این داخلی در حال حاضر در سیستم فعال است و هنوز خروج ثبت نشده است.'
                        ]);
                    }
                }
            }
        } catch (\Throwable $e) {}

        // Validate shift time window (allow 1h before start and 1h after end)
        try {
            $shiftData = data_get($validated, 'personnelDetails', []);
            $timeStart = data_get($shiftData, 'timestart');
            $timeEnd   = data_get($shiftData, 'timeend');

            if ($timeStart && $timeEnd) {
                $now = \Carbon\Carbon::now();
                $start = \Carbon\Carbon::parse($timeStart);
                $end   = \Carbon\Carbon::parse($timeEnd);

                // Handle overnight shifts (end earlier than start)
                if ($end->lessThan($start)) {
                    $end->addDay();
                }

                $windowStart = $start->copy()->subHour();
                $windowEnd   = $end->copy()->addHour();

                if (!$now->between($windowStart, $windowEnd)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'زمان ورود خارج از بازه مجاز شیفت است.'
                    ], 403);
                }
            }
        } catch (\Throwable $e) {
            // If parsing fails, block login to be safe
            return response()->json([
                'status' => 'error',
                'message' => 'اطلاعات زمان شیفت نامعتبر است.'
            ], 422);
        }

        // Find user associated with this personnel
        $user = User::with("personnel")->where('personnel_id', $personnel->id)->first();

      if(!$user){
            try {
                LoginLog::create([
                    'personnel_id' => $personnel->id,
                    'user_id' => null,
                    'user_type' => 'operator',
                    'ip' => $request->ip(),
                    'extension' => data_get($validated, 'personnelDetails.extension'),
                    'user_agent' => $request->userAgent(),
                    'shift_data' => data_get($validated, 'personnelDetails'),
                    'request_payload' => $request->except(['password']),
                    'success' => false,
                ]);
            } catch (\Throwable $e) {}
            return response()->json([
            'status'=>'error',
                'message'=>'نام کاربری یا رمز عبور یافت نشد'
            ]);
      }

        

        // Verify password
        if (!Hash::check($validated['password'], $user->password)) {
            try {
                LoginLog::create([
                    'personnel_id' => $personnel->id,
                    'user_id' => $user->id,
                    'user_type' => 'operator',
                    'ip' => $request->ip(),
                    'extension' => data_get($validated, 'personnelDetails.extension'),
                    'user_agent' => $request->userAgent(),
                    'shift_data' => data_get($validated, 'personnelDetails'),
                    'request_payload' => $request->except(['password']),
                    'success' => false,
                ]);
            } catch (\Throwable $e) {}
            return response()->json([
            'status'=>'error',
                'message'=>'رمز عبور اشتباه است.'
            ]);
        }

        // Laravel Sanctum: issue token for API use
        $token = $user->createToken('api')->plainTextToken;

        // log success
        try {
            LoginLog::create([
                'personnel_id' => $personnel->id,
                'user_id' => $user->id,
                'user_type' => 'operator',
                'ip' => $request->ip(),
                'extension' => data_get($validated, 'personnelDetails.extension'),
                'user_agent' => $request->userAgent(),
                'shift_data' => data_get($validated, 'personnelDetails'),
                'request_payload' => $request->except(['password']),
                'success' => true,
            ]);
        } catch (\Throwable $e) {}

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

    public function adminlogin(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $username = trim($validated['username']);
        $user = null;

        // 1) Try to find user directly by username (treat as email or name)
        $user = User::with('personnel')
            ->where('username', $username)
            ->first();

        // 2) If not found and username is a national code, resolve via personnel -> user
        if (!$user && preg_match('/^\d{10}$/', $username)) {
            $personnel = Personnel::where('national_code', $username)->first();
            if ($personnel) {
                $user = User::with('personnel')->where('personnel_id', $personnel->id)->first();
            }
        }

        if (!$user) {
            try {
                LoginLog::create([
                    'personnel_id' => isset($personnel) && $personnel ? $personnel->id : null,
                    'user_id' => null,
                    'user_type' => 'admin',
                    'ip' => $request->ip(),
                    'extension' => null,
                    'user_agent' => $request->userAgent(),
                    'shift_data' => null,
                    'request_payload' => $request->except(['password']),
                    'success' => false,
                ]);
            } catch (\Throwable $e) {}
            return response()->json([
                'status' => 'error',
                'message' => 'نام کاربری یا رمز عبور یافت نشد'
            ]);
        }

        if (!Hash::check($validated['password'], $user->password)) {
            try {
                LoginLog::create([
                    'personnel_id' => $user->personnel_id ?? null,
                    'user_id' => $user->id,
                    'user_type' => 'admin',
                    'ip' => $request->ip(),
                    'extension' => $user->extension ?? null,
                    'user_agent' => $request->userAgent(),
                    'shift_data' => null,
                    'request_payload' => $request->except(['password']),
                    'success' => false,
                ]);
            } catch (\Throwable $e) {}
            return response()->json([
                'status' => 'error',
                'message' => 'رمز عبور اشتباه است.'
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        // log success
        try {
            LoginLog::create([
                'personnel_id' => $user->personnel_id ?? null,
                'user_id' => $user->id,
                'user_type' => 'admin',
                'ip' => $request->ip(),
                'extension' => $user->extension ?? null,
                'user_agent' => $request->userAgent(),
                'shift_data' => null,
                'request_payload' => $request->except(['password']),
                'success' => true,
            ]);
        } catch (\Throwable $e) {}

        return response()->json([
            'status' => 'success',
            'data' => [
                'token' => $token,
                'user' => $user->load('personnel')
            ]
        ]);
    }
}


