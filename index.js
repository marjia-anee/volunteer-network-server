const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tantc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());


const port = 5000;

app.get('/', (req, res) =>{
  res.send('hello from db')
})

const client = new MongoClient(uri, {useUnifiedTopology: true , useNewUrlParser: true });
client.connect(err => {
  const tasksCollection = client.db("volunteerActivities").collection("tasks");
  console.log('database connected');

  const registersCollection = client.db("volunteerActivities").collection("registers");


  app.post('/addTasks', (req, res) => {
    const task = req.body;
    tasksCollection.insertOne(task)
    .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
        console.log(result);
    })
  })

  app.get('/tasks', (req, res) => {
    tasksCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/task/:_id', (req, res) => {
    tasksCollection.find({_id: ObjectId(req.params._id) })
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })


  app.post('/addReg', (req, res) => {
    const register = req.body;
    registersCollection.insertOne(register)
    .then(result => {
        res.send(result.insertedCount > 0)
        console.log(result);
    })
  })

  app.get('/regDetails', (req, res) => {
    registersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })


  app.delete('/regDetailsDelete/:_id', (req, res) => {
    registersCollection.deleteOne({_id: req.params._id})
    .then( result => {
      console.log(result);
    })
  })


});


app.listen(process.env.PORT || port);