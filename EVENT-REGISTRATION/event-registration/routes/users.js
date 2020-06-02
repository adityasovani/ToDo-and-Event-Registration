var express = require('express');
var router = express.Router();

// Configure MongoDB
var mongo = require('mongodb')
const MongoClient = mongo.MongoClient

const uri = 'mongodb+srv://frost:sierradelta@cluster0-x5mvs.mongodb.net/Event?retryWrites=true&w=majority'

var client;

var mongoClient = new MongoClient(uri, {
	useNewUrlParser: true, useUnifiedTopology: true
})
mongoClient.connect((err, db) => { // returns db connection
	if (err != null) {
		console.log(err)
		return
	}
	else {
		console.log('Uplink complete');
	}
	client = db
})

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('In users controller');
});

router.post('/register', (req, res) => {

	req.body.token = require('crypto').createHash('sha256').update(req.body.email + req.body.fullName).digest('hex')

	const sendmail = require('sendmail')();
	sendmail(
		{
			from: "Admin <no-reply@geeksmeetup.com>",
			to: req.body.email,
			subject: 'Please Verify Email',
			html: `
			Hello ${req.body.fullName},
			<br>
			We are glad to see your interest for our event. <br>
			Please click on below link to confirm your email to add your entry and so you will be able to attend the meetup. <br>
			<a href="https://event-registration-app.firebaseapp.com/confirm/${req.body.token}" target="_">Click here</a>
			`
		},
		(err, reply) => {
			if (err) { console.log(err); }
			else {
				let collection = client.db('Event').collection('users')
				req.body.date = new Date()
				req.body.registrationId = "076241001b22acd85b27270bf1b9c732".split('').sort(() => { return 0.5 - Math.random() }).join('').slice(1, 8)
				req.body.confirmed = false
				collection.insertOne(req.body, (err, result) => {
					if (err)
						console.log(err)
					else
						res.send(result.ops[0])
				});
			}
		}
	);

})

router.get('/confirm/:token', (req, res) => {
	let collection = client.db('Event').collection('users')
	collection.findOne({ token: req.params.token }, (error, response) => {
		if (error) console.log(error)
		else {
			collection.updateOne({ token: req.params.token }, { $set: { confirmed: true } }, (err, result) => {
				if (err) console.log(err)
				else {
					res.send({
						fullName: response.fullName,
						mobile: response.mobile,
						email: response.email,
						registrationId: req.params.token.split('').sort(() => { return 0.5 - Math.random() }).join('').slice(0, 7)
					})
				}
			})
		}
	})
})

//FindAll except image
router.get('/findAll', (req, res) => {
	let collection = client.db('Event').collection('users')
	collection.find({ confirmed: true }, {
		projection: {
			"_id": 1,
			"fullName": 1,
			"mobile": 1,
			"email": 1,
			"registrationType": 1,
			"noOfTicket": 1,
			"date": 1
		}
	}).toArray((err, result) => {
		if (err) console.log(err)
		else res.send(result)
	})
})

// Find one
router.get('/findOne/:_id', (req, res) => {
	let collection = client.db('Event').collection('users')
	collection.findOne({ _id: mongo.ObjectID(req.params._id) }, (err, result) => {
		if (err) console.log(error)
		else res.send(result)
	})
})

module.exports = router;
