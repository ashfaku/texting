const express = require('express'); //Line 1
const cors = require('cors');
const app = express(); //Line 2
const bodyParser = require('body-parser')
app.use(cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
app.post('/express_backend', (req, res) => {
	 let userInfo = req.body;
	 console.log(userInfo);
	 res.send(req.body);
})


app.get('/express_backend', (req, res) => { //Line 9
  res.send({ "names": list}); //Line 10
}); //Line 11