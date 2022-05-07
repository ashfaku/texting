var app = require('express')();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
var http = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
var io = require('socket.io')(http);

var createRoom = io.of("/creationRoom");
var logRoom = io.of("/logRoom");
var loggedIn = io.of("/chatting");

const uri = "mongodb+srv://ashfaku:Ashman123@cluster0.w7fyh.mongodb.net/Cluster0?retryWrites=true&w=majority";
const data = new MongoClient(uri);
const dbName = "Cluster0";                      

logRoom.on('connection', (socket) => {
	console.log(`Logging in with id of ${socket.id}`);
	socket.on('login', async (m) => {
		console.log(m.clientID);
		const col = data.db(dbName).collection("accounts");
		var myDoc = await col.findOne({
			"username" : m.username, 
			"password" : m.password
		});
		logRoom.to(m.clientID).emit('login', myDoc);
	});	
	
	socket.on('disconnect', () => {
		console.log("Disconnected from login");
	});
});

createRoom.on('connection', (socket) => {
	console.log(`Creating with id ${socket.id}`)
	socket.on('createAccount', async (msg) => {
		console.log(msg);
		var s = await run(msg).catch(console.dir);
		createRoom.to(msg.clientID).emit('status', s);
	});
	
	socket.on('disconnect', () => {
		console.log("Disconnected from creating");
	});
});

loggedIn.on('connection', (socket) => {
	console.log("Logged in");
	socket.on('dataReq', async (msg) => {
		console.log(msg);
		loggedIn.to(msg.clientID).emit('textDocs', await getInitialData(msg.own));	
		await getInitialFriendList(msg.own);
		// here i have to get the friend list of msg.own from accounts collection
	});
});

// returns every document in texting collection 
async function getInitialData(own)
{
	var myDoc;
	try 
	{	
		const db = data.db(dbName);
		const col = db.collection("texting");
		myDoc = await col.find({usernames: { $all : [own] } });
		return await myDoc.toArray();
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
}
async function getInitialFriendList(own)
{
	var myDoc;
	try 
	{	
		const db = data.db(dbName);
		const col = db.collection("accounts");
		myDoc = await col.findOne({username: own});
		console.log(myDoc);
		return myDoc;
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
}


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
app.use(cors());

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
		var myDoc = await col.findOne({username : doc.username});
		var v = "Not allowed";
		if (myDoc === null)
		{
			colors = [];
			const account = 
			{
				"username" : doc.username,
				"password" : doc.password,
				"email" : doc.email,
				"friendList" : [] // sample list for testing
				
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

async function insertData(m)
{
	const db = data.db(dbName);
	const col = db.collection("texting");
	var filter = {usernames: [m.name, m.other]};
	var myDoc = await col.findOne(filter);
	if (myDoc === null)
	{
		filter = {usernames: [m.other, m.name]}
		myDoc = await col.findOne(filter);
	}
	console.log(myDoc);
	var mg = {
		msg: m.message,
		date: m.date,
		name: m.name,
		color: m.color
	}	
	try 
	{
		var tmp = myDoc.dmList;
		tmp.push(mg);
		var options = { upsert: false };
		var updateDoc = {
			$set: {
				dmList: tmp
			},
		};
		var result = await col.updateOne(filter, updateDoc, options);
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
}
http.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});


/*io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected data
    socket.emit('connection', "Client connected");	
	socket.on('creating', (m) => {
		creating.push(m);
	//	console.log(creating);
	});
	socket.on('login', async (m) => {

		const col = data.db(dbName).collection("accounts");
		var myDoc = await col.findOne({
			"username" : m.username, 
			"password" : m.password
		});
		io.to(m.clientID).emit('login', myDoc);
	});
	socket.on('lonely', (msg) => {
		loggedIn.push(msg);
		console.log(loggedIn);
	});
	socket.on('createAccount', async (msg) => {
	//	console.log(msg);
		var s = await run(msg).catch(console.dir);
		io.to(msg.clientID).emit('status', s);
	});
	socket.on('initialList', async (msg) => {
		loggedIn.push({
			id : msg.clientID,
			name: msg.own
		});
		io.to(msg.clientID).emit('initialData', await getInitialData(msg.own, msg.username));
		const changeStream = data.db("Cluster0").collection("texting").watch();
		
		
		// FIGURE OUT HOW TO CHECK FOR ONLY DOC UPDATE NOT DOC ADDING HERE
		
		
		changeStream.on('update', async (next) => {
			//var myDoc = await data.db("Cluster0").collection("texting").find().toArray();
			if (next.updateDescription != null && next.updateDescription.updatedFields != null)
			{
				var c = next.updateDescription.updatedFields.dmList;
				var doc = await data.db(dbName).collection("texting").findOne({dmList: c});
				var u = doc.usernames;
				console.log(next);
				console.log(loggedIn);
				for (let i = 0; i < loggedIn.length; i++)
				{
					for (let j = 0; j < u.length; j++)
					{
						if (loggedIn[i].name === u[j])
							io.to(loggedIn[i].id).emit('update', c);
					}
				}
			}
		//	loggedIn.forEach((e) => io.to(e).emit('update',  myDoc));
		});
	});
	socket.on('sendData', async (msg) => {
	//	console.log(msg);
		// INPUT DATA
		insertData(msg);
	});
	socket.on('disconnect', () => {
		
		
		
	});
	socket.on('friendRequest', async (msg) => {
		const col = data.db(dbName).collection("accounts");
		var filter = {"username" : msg.username};
		var account = await col.findOne(filter);
		if (account === null)
		{
	//		console.log("No account");
			io.to(msg.clientID).emit('requestFound', "Not Found");
		}
		else
		{
		//	console.log("found");
			var tmp = account.friendList;
			// check if it contains alrdy 
			
			if (tmp.includes(msg.own))
			{
				io.to(msg.clientID).emit('requestFound', "You're already a friend to this user");
				return;
			}
			
			tmp.push(msg.own);
			// update friend list here 
			var options = { upsert: false };
			var updateDoc = {
				$set: {
					friendList: tmp
				},
			};
			var result = await col.updateOne(filter, updateDoc, options);
		
			account = await col.findOne({username: msg.own});
			tmp = account.friendList;
			tmp.push(msg.username);
			// update friend list here 
			updateDoc = {
				$set: {
					friendList: tmp
				},
			};
			result = await col.updateOne({username: msg.own}, updateDoc, options);
			// make a doc for this pair of users HERE
			const db = data.db("Cluster0");
			const coll = db.collection("texting");
			await coll.insertOne({
				usernames: [msg.username, msg.own],
				dmList: []
			});
			for (let i = 0; i < loggedIn.length; i++)
			{
				if (loggedIn[i].name == msg.own)
					io.to(loggedIn.id).emit('updateList', msg.username);
				if (loggedIn[i].name == msg.username)
					io.to(loggedIn.id).emit('updateList', msg.own);
				
			}
			io.to(msg.clientID).emit('requestL', tmp);		
			io.to(msg.clientID).emit('requestFound', "Found");
		}
	});
});*/