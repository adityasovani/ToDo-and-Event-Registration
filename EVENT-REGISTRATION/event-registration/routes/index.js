var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')

// Configure MongoDB
var mongo = require('mongodb')
const MongoClient = mongo.MongoClient

const uri =  'mongodb+srv://frost:sierradelta@cluster0-x5mvs.mongodb.net/Event?retryWrites=true&w=majority'

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


/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Welcome')
});

//Login
router.post('/login', (req, res) => {
  let collection = client.db('Event').collection('admin')
  collection.findOne({ "userName": req.body.userName }, (error, result) => {
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
            userName: result.userName,
          })
        }

      })
    }
  })
})



module.exports = router;
