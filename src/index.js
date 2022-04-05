import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
// Replace the following with your Atlas connection string                                                                                              
const { MongoClient } = require("mongodb");
const url = "mongodb+srv://ashfaku:Ashman123@react-mongo-texting.vbevz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url);

async function run() 
{
    try 
	{
        await client.connect();
        console.log("Connected correctly to server");
    }
	catch (err) 
	{
        console.log(err.stack);
    }
    finally 
	{
        await client.close();
    }
}

run().catch(console.dir);
class Message extends React.Component
{
	render()
	{
		return <div>
		{this.props.value.name}
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
    this.state = { msgs: [] };
  }
  async componentDidMount() {
  //  let c = await getCities(db);
  //  this.setState({ msgs: c });
  }

  componentWillUnmount() {}
  render() 
  {
    return <div>{this.state.msgs.map((e) => <Message value = {e} />)}
	<Send />
	
	</div>;
  
  }
}
ReactDOM.render(<List />, document.getElementById("root"));