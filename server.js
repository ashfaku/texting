const express = require('express'); 
const cors = require('cors');
const ws = require('ws');

const app = express();
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const port = process.env.PORT || 5000;

const uri = "mongodb+srv://ashfaku:Ashman123@cluster0.w7fyh.mongodb.net/Cluster0?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = "Cluster0";                      
async function connect()
{
	try
	{
		await client.connect();
	}
	catch (err)
	{
		console.log(err.stack);
	}
}
connect();
console.log("Connected to database");
async function run(doc) 
{
    try 
	{
		const db = client.db(dbName);
		const col = db.collection("accounts");
		var myDoc = await col.findOne({"username" : doc.username});
		var v = "Not allowed";
		if (myDoc === null)
		{
			const account = 
			{
				"username" : doc.username,
				"password" : doc.password,
				"email" : doc.email,
				"friendList" : ['Wilson', 'Tofu', 'Vicky'] // sample list for testing
			};
			await col.insertOne(account);	 
			myDoc = account;
			v = "Allowed";
		}
		return {
			"status" : v,
			"account" : myDoc
		};
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
}
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', async message => { 
	message = JSON.parse(message);
	if (message.type == "texting")
	{
		try 
		{	
			const db = client.db(dbName);
			const col = db.collection("texting");
			var myDoc = await col.find().toArray();
			myDoc.forEach((e) => console.log(e));
			socket.send(JSON.stringify(myDoc));
		}	
		catch (err) 
		{
			console.log(err.stack);
		}
	}
	else if (message.type == "sendData")
	{	
		var data = {
			msg: message.message,
			date: message.date,
			name: message.name,
			color: message.color
		}	
		try 
		{
			const db = client.db(dbName);
			const col = db.collection("texting");
			await col.insertOne(data);
			var myDoc = await col.find().toArray();
			myDoc.forEach((e) => console.log(e));
			socket.send(JSON.stringify(myDoc));
		}	
		catch (err) 
		{
			console.log(err.stack);
		}
		//console.log(status);
	}
	else if (message.type == "create")
	{
		var email = message.email;
		var username = message.username;
		var password = message.password;
		var status = await run(message).catch(console.dir);
		//console.log(status);
		socket.send(JSON.stringify(status));
	}
 });
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port);
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
