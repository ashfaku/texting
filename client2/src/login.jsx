import React from 'react';
import './login.css';
import logo from './logo1.svg';
class Login extends React.Component
{
	login()
	{
		var u = document.getElementById('u');
		var p = document.getElementById('p');
		var info = 
		{
			"username" : u.value,
			"password" : p.value
		};
		console.log(info);
	}
	create()
	{
	}
	render()
	{
		return <div>
		        <img src={logo} className="App-logo" alt="logo" />
				<div id = "title">Nuclei</div>
				<div id = "login"> 
					<input type = "text" id = "u" placeholder = "Username..."></input>
					<input type = "text" id = "p" placeholder = "Password..."></input>
				</div>
				<button id = "loginButton" onClick = {this.login}>Login</button>
				<div id = "line">or</div>
				<button id = "createAccount" onClick = {this.create}>Create New Account</button>
		
		</div>
	}
}

export default Login;