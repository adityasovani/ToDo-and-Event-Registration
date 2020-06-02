
var express = require('express');
var router = express.Router();

// Configure MongoDB
var mongo = require('mongodb')
const MongoClient = mongo.MongoClient

//Reading connection URI from environment variables instead of hardcoding
//Replace 'process.env.connectionString' with your string. 
//Ignore 'require('dotenv').config()' if not using env variables
require('dotenv').config()
const uri = process.env.connectionString

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

//URL mappings

router.get('/', (req, res) => {
  res.send('In toDo controller');
});

//FindBy id [view tasks of a user]
router.get('/findById/:_id', (req, res) => {
  let collection = client.db('ToDo').collection('auth')
  collection.findOne({ "_id": mongo.ObjectID(req.params._id) }, function (err, result) {
    if (err)
      console.log(err)
    else
      res.send(result.tasks);
  });
})

//Find completed tasks of user
router.get('/findCompletedById/:_id', (req, res) => {
  let collection = client.db('ToDo').collection('auth')
  collection.findOne({ "_id": mongo.ObjectID(req.params._id) }, function (err, result) {
    if (err)
      console.log(err)
    else
      res.send(result.archieved);
  });
})

//Add Task to existing user
router.post('/addTask/:id', (req, res) => {

  let collection = client.db('ToDo').collection('auth')
  collection.findOneAndUpdate(
    { "_id": mongo.ObjectID(req.params.id) },
    { $push: { tasks: req.body } },
    (error, result) => {
      if (error) {
        console.log(error);
        return
      }
      res.send({ message: 'TASK_ADDED' })
    });
})

//Complete task of existing user
router.put('/complete/:_id', (req, res) => {
  let collection = client.db('ToDo').collection('auth')
  collection.updateOne({ "_id": mongo.ObjectID(req.params._id) },
    { $pull: { "tasks": { "taskId": parseInt(req.body.taskId) } } },
    (err, results) => {
      if (err) {
        console.log(err)
        return
      }
      res.send({ message: 'TASK_COMPLETED' }) // returns the new document
    })
  collection.findOneAndUpdate({ "_id": mongo.ObjectID(req.params._id) }, { $push: { archieved: req.body } })
})

//Remove task from completed
router.put('/incomplete/:_id', (req, res) => {
  let collection = client.db('ToDo').collection('auth')
  collection.updateOne({ "_id": mongo.ObjectID(req.params._id) },
    { $pull: { "archieved": { "taskId": parseInt(req.body.taskId) } } },
    (err, results) => {
      if (err) {
        console.log(err)
        return
      }
      res.send({ message: 'TASK_INCOMPLETED' }) // returns the new document
    })
  collection.findOneAndUpdate({ "_id": mongo.ObjectID(req.params._id) }, { $push: { tasks: req.body } })
})

//DELETE request
router.delete('/delete/:_id/:taskId', (req, res) => {
  let collection = client.db('ToDo').collection('auth')
  collection.updateOne({ "_id": mongo.ObjectID(req.params._id) },
    { $pull: { "tasks": { "taskId": parseInt(req.params.taskId) } } },
    (err, results) => {
      if (err) {
        console.log(err)
        return
      }
      res.send({ message: 'TASK_REMOVED' }) // returns the new document
    })
})

module.exports = router;