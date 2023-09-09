<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get();

        return $users;
    }

    public function store(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return $user;
    }

    public function update(User $user)
    {
        $user->update([
            'name' => request('name'),
            'email' => request('email'),
            'password' => request('password') ?  bcrypt(request('password')) : $user->password,
        ]);

        return $user;
    }
}
