<?php

namespace App\Http\Controllers\Admin;

use App\Admin;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{

	public function showRegistrationForm()
	{
	  return view('admin.auth.register');
	}

	public function register(Request $request)
    {

       //Validates data
        $this->validator($request->all())->validate();

       //Create admin
        $admin = $this->create($request->all());

        //Authenticates admin
        $this->guard()->login($admin);

       //Redirects sellers
        return redirect($this->redirectPath);
    }


    //Validates user's Input
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:sellers',
            'password' => 'required|min:6|confirmed',
        ]);
    }


      //Create a new admin instance after a validation.
    protected function create(array $data)
    {
        return Admin::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }

     //Get the guard to authenticate Admin
	protected function guard()
	{
		return Auth::guard('admin');
	}


}
