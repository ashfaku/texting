const express = require('express'); //Line 1
const cors = require('cors');
const app = express(); //Line 2
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const uri = "yur mom";
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
console.log("Connected correctly to server");    

async function run(doc) 
{
    try 
	{
         const db = client.db(dbName);
         const col = db.collection("accounts");
		 const myDoc = await col.find();
		 myDoc.forEach(e => 
		 {
			if (e.username === doc.username)
			{
				app.get('/express_backend', (req, res) => 
				{ 
					res.send({"accountCreation" : "Account already here"});
				});
				return; // we found a dupe account 
			}
		 });
		 const account = 
		 {
			 "username" : doc.username,
			 "password" : doc.password,
			 "email" : doc.email,
			 "friendList" : ['Wilson', 'Tofu', 'Vicky'] // sample list for testing
		 };
		 await col.insertOne(account);	 
	}	
	catch (err) 
	{
		console.log(err.stack);
	}
}
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.post('/express_backend', (req, res) => 
{
	let userInfo = req.body;
//	console.log(userInfo);
	run(userInfo).catch(console.dir);
	res.send(req.body);
})

app.get('/express_backend', (req, res) => { //Line 9
  res.send({"idk" : "poop"}); //Line 10
}); //Line 11