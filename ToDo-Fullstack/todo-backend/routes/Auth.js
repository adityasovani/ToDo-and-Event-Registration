var express = require('express');
const bcrypt = require('bcrypt')
var router = express.Router();

// Configure MongoDB
var mongo = require('mongodb')
const MongoClient = mongo.MongoClient

//Reading connection URI from environment variables instead of hardcoding

require('dotenv').config()                      //Ignore if not using env variables
const uri = process.env.connectionString        //place your own DB connection string

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
        console.log('Uplink complete: Auth');
    }
    client = db
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('In auth service');
});

//Add User
router.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        client.db('ToDo').collection('auth').findOne({ "userId": req.body.userId }, (error, result) => {
            if (result !== null) {
                res.send({ message: "USER_EXISTS" })
                return
            }
            else {
                let collection = client.db('ToDo').collection('auth')
                collection.insertOne({
                    name: req.body.name,
                    userId: req.body.userId,
                    password: hash,
                    tasks: [],
                    archieved: []
                }, function (err, results) {
                    if (err) {
                        console.log(err)
                        res.send('Having trouble')
                        return
                    }
                    res.send(results.ops[0]) // returns the new document
                })
            }
        })
    })
})

//Login
router.post('/login', (req, res) => {
    let collection = client.db('ToDo').collection('auth')
    collection.findOne({ "userId": req.body.userId }, (error, result) => {
        if (error)
            console.log(error)
        else {
            if (result == null) {
                res.send({ message: 'user_doesnt_exist' })
                return
            }
            bcrypt.compare(req.body.password, result.password, (error, same) => {
                if (!same)
                    res.send({ message: 'PASSWORD_INCORRECT' })
                else {
                    res.send({
                        _id: result._id,
                        name: result.name,
                        userId: result.userId,
                        tasks: [],
                        archieved: []
                    })
                }

            })
        }
    })
})

module.exports = router;
