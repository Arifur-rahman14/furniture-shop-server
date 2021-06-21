const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express()
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

require('dotenv').config()


const port = process.env.PORT || 8888

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

// login user name onlinefurnitureshop
// password 
//  mongo db 


const uri = "mongodb+srv://:<password>@cluster0.coppg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1cbww.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error', err)
  const productCollection = client.db("furniture").collection("products");
  const ordersCollection = client.db("furniture").collection("orders");


  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        res.send(items);

      })

  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product:', newProduct);
    productCollection.insertOne(newProduct)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })


  app.get('/product/:id', (req, res) => {
    console.log(req.params.id);
    productCollection.find({ _id: ObjectId(req.params.id) })

      .toArray((err, items) => {
        res.send(items[0])
        console.log(items);
        console.log(err)
      })
  })
  app.get('/productManage', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        res.send(items)
        console.log('from data base', items);
      })
  })

  app.delete('/delete/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    console.log('deleted id', id)
    productCollection.findOneAndDelete({ _id: id })
      .then(result => { result.deletedCount > 0 })

  })

  app.post('/addOrders',(req, res) =>{
    const newProduct =req.body;
    console.log('added new product', newProduct)
    ordersCollection.insertOne(newProduct)
    .then(result =>{
      console.log('insertedCount',result.insertedCount);
      res.send(result.insertedCount > 0)
    })
})
  app.get('/order', (req, res) => {
    const queryEmail = req.query.email;
    ordersCollection.find({email: queryEmail})
    .toArray((err, documents) => {
      res.send(documents)
      console.log(documents)
      console.log(err);
    })
  })

});


app.listen(process.env.PORT || port)