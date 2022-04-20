var app = require('express')();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
var http = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
var io = require('socket.io')(http);

var creating = [];
var loggedIn = [];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
app.use(cors());

const uri = "mongodb+srv://ashfaku:Ashman123@cluster0.w7fyh.mongodb.net/Cluster0?retryWrites=true&w=majority";
const data = new MongoClient(uri);
const dbName = "Cluster0";                      
async function connect()
{
	try
	{
		await data.connect();
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
		const db = data.db(dbName);
		const col = db.collection("accounts");
		var myDoc = await col.findOne({"username" : doc.username});
		var v = "Not allowed";
		if (myDoc === null)
		{
			colors = [];
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
async function getInitialData()
{
	var myDoc;
	try 
	{	
		const db = data.db(dbName);
		const col = db.collection("texting");
		myDoc = await col.find().toArray();
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
	return myDoc;
}
async function insertData(message)
{
	var mg = {
		msg: message.message,
		date: message.date,
		name: message.name,
		color: message.color
	}	
	try 
	{
		const db = data.db("Cluster0");
		const col = db.collection("texting");
		await col.insertOne(mg);
		var myDoc = await col.find().toArray();
		myDoc.forEach((e) => console.log(e));
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
	//console.log(status);
}
http.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected data
    socket.emit('connection', "Client connected");	
	socket.on('creating', (m) => {
		creating.push(m);
		console.log(creating);
	});
	socket.on('createAccount', async (msg) => {
		console.log(msg);
		var s = await run(msg).catch(console.dir);
		io.to(msg.clientID).emit('status', s);
	});
	socket.on('initialList', async (msg) => {
		loggedIn.push(msg.clientID);
		io.to(msg.clientID).emit('initialData', await getInitialData());
		const changeStream = data.db("Cluster0").collection("texting").watch();
		changeStream.on('change', async (next) => {
			var myDoc = await data.db("Cluster0").collection("texting").find().toArray();
			loggedIn.forEach((e) => io.to(e).emit('update',  myDoc));
		});

	});
	socket.on('sendData', async (msg) => {
		console.log(msg);
		// INPUT DATA
		insertData(msg);
	});
});