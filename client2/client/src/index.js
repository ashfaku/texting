import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import {Helmet} from "react-helmet";
import './index.css';
class Message extends React.Component
{
	render()
	{
		console.log(this.props.color);
		return <div className = "message">
			<div className = "header">
				<span className = {`name ${this.props.color}`}>{this.props.name}</span>		
				<span className = "date">{this.props.color}</span>
			</div>
			<div className = "text">{this.props.text}</div>
		</div>
	}
}
class Setup extends React.Component
{
	render()
	{
		return <div> 
			<Helmet>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin / >
				<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet" />
			</Helmet>
		</div>
	}

}
class Send extends React.Component
{
	async send()
	{
		const docData = 
		{
			stringExample: document.getElementById("input").text,
		};
		var elements = document.getElementsByClassName("name");
		console.log(elements);
	}
	render()
	{
		return <div>
		<input type = "text" id = "input"></input>
		<button id = "send" onClick={this.send}>Send</button>
		</div>
	}

}
class List extends React.Component 
{
	constructor(props) 
	{
		super(props);
		this.state = { names: [], texts : [] };
	}
	async componentDidMount() 
	{
		let b = await this.callBackendAPI();//.then(res => 
		console.log(b);
		this.setState({ names: b.names });//.catch(err => console.log(err));
	}
    // fetching the GET route from the Express server which matches the GET route from server.js
	callBackendAPI = async () => 
	{
		const response = await fetch('http://localhost:5000/express_backend/');
		const body = await response.json();
		if (response.status !== 200) 
		{
			throw Error(body.message) 
		}
		return body;
	};

	componentWillUnmount() {}
	render() 
	{
		let i = 0;	
		return (
			<div><Setup />{this.state.names.map((e) => <Message name = {e.name} text = {e.msg} color = {e.color} key = {i++} />)}
			
			<Send />
		</div>);
		//	<link rel="preconnect" href="https://fonts.googleapis.com">
		//	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		//	<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
		//</div>);

	}
}
const container = document.getElementById('root');

// Create a root.
const root = ReactDOMClient.createRoot(container);
root.render(<List />);