<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\InterviewController;
use App\Http\Middleware\RateLimitAI;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/register', function(Request $request) {
    // Simple mock registration for demo
    return response()->json([
        'message' => 'Registration successful',
        'user' => [
            'id' => 1,
            'name' => $request->name ?? 'Demo User',
            'email' => $request->email ?? 'demo@example.com',
        ],
        'token' => 'demo-token-' . uniqid()
    ]);
});

Route::post('/login', function(Request $request) {
    // Simple mock login for demo
    return response()->json([
        'message' => 'Login successful',
        'user' => [
            'id' => 1,
            'name' => 'Demo User',
            'email' => $request->email ?? 'demo@example.com',
        ],
        'token' => 'demo-token-' . uniqid()
    ]);
});

// Protected routes (require authentication)
// Note: For demo, we're making these accessible without auth
// In production, uncomment the auth:sanctum middleware
Route::middleware(['api'])->group(function () {
    
    // Get authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Interview routes with AI rate limiting
    Route::prefix('interviews')->group(function () {
        
        // List all interviews (no rate limit needed for reads)
        Route::get('/', [InterviewController::class, 'index']);
        
        // Get specific interview (no rate limit needed for reads)
        Route::get('/{id}', [InterviewController::class, 'show']);
        
        // Start new interview (AI rate limited)
        Route::post('/', [InterviewController::class, 'start'])
            ->middleware(RateLimitAI::class . ':10');
        
        // Submit response to interview (AI rate limited - most expensive operation)
        Route::post('/{id}/respond', [InterviewController::class, 'respond'])
            ->middleware(RateLimitAI::class . ':10');
        
        // End interview and get score (AI rate limited)
        Route::post('/{id}/end', [InterviewController::class, 'end'])
            ->middleware(RateLimitAI::class . ':10');
    });
});

// Health check endpoint
Route::get('/health', function() {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
        'service' => 'AI Interviewer API'
    ]);
});
