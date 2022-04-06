const express = require('express'); //Line 1
const cors = require('cors');
const app = express(); //Line 2
app.use(cors());
const port = process.env.PORT || 5000; //Line 3
console.log(port);
// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
list = [
	{ 
		name : 'Ashfak',
		msg : 'Everything is doomed',
		color : 'red'
	},
	{
		name : 'Tiffanie',
		msg : 'What does that mean',
		color : 'blue'
	},
	{
		name : 'Victor',
		msg : 'hei',
		color : 'green'
	},
	{
		name : 'Zhipeng',
		msg : 'bruh',
		color : 'yellow'
	},
	{
		name : 'Zhipeng',
		msg : 'bruh',
		color : 'yellow'
	},
	{
		name : 'Zhipeng',
		msg : 'bruh',
		color : 'yellow'
	},
	{
		name : 'Zhipeng',
		msg : 'bruh',
		color : 'yellow'
	}
];
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ "names": list}); //Line 10
}); //Line 11