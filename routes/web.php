<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Inertia\Inertia;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

// admin route
Route::get('/admin/ExclusiveReports', function () { return Inertia::render('admin/ExclusiveReports');});
Route::get('/admin/DashboardPT3', function () { return Inertia::render('admin/DashboardPT3');});
Route::get('/admin/ManagementPT3', function () { return Inertia::render('admin/ManagementPT3');});
Route::get('/admin/DetailLOP', function () { return Inertia::render('admin/DetailLOP');});
Route::get('/admin/EvalSubconPT3', function () { return Inertia::render('admin/EvalSubconPT3');});
Route::get('/admin/DashboardPT2', function () { return Inertia::render('admin/DashboardPT2');});
Route::get('/admin/ManagementPT2', function () { return Inertia::render('admin/ManagementPT2');});
Route::get('/admin/UserManagement', function () { return Inertia::render('admin/UserManagement');});
Route::get('/admin/Setting', function () { return Inertia::render('admin/Setting');});
Route::get('/admin/Notification', function () { return Inertia::render('admin/Notification');});
Route::get('/admin/Profile', function () { return Inertia::render('admin/Profile');});


// mitra admin route
Route::get('/mitraAdmin/MitraManagementPT3', function () { return Inertia::render('mitraAdmin/MitraManagementPT3');});
Route::get('/mitraAdmin/DetailLOP', function () { return Inertia::render('mitraAdmin/DetailLOP');});
Route::get('/mitraAdmin/Notification', function () { return Inertia::render('mitraAdmin/Notification');});

// ed admin route
Route::get('/edAdmin/EdManagementPT3', function () { return Inertia::render('edAdmin/EdManagementPT3');});
Route::get('/edAdmin/DetailLOP', function () { return Inertia::render('edAdmin/DetailLOP');});
Route::get('/edAdmin/Notification', function () { return Inertia::render('edAdmin/Notification');});

require __DIR__.'/settings.php';
