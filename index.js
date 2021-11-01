const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
// const MongoClient = require("mongodb").MongoClient;


const app = express()
const port = process.env.PORT || 5000

//middleware configuration
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3amxu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();

        const database = client.db("destination");
        const serviceCollection = database.collection("services");
        const myOrderCollection = database.collection("orders");


        // const serviceCollection = client.db('destination').collection('services')
        // const myOrderCollection = client.db('destination').collection('orders');


        // get api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })


        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            console.log('getting specific id', id)
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })

        // add service
        app.post("/services", async (req, res) => {
            const service = req.body
            console.log('hit the post', service)
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });





        // GET API (get all orders)
        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = myOrderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // GET API (get orders by email)
        app.get('/myOrders/:email', async (req, res) => {
            const email = req.params.email;
            console.log('hit the post')
            const query = { email: email };
            const cursor = myOrderCollection.find(query);
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        })



        // POST API
        app.post('/placeOrder', async (req, res) => {
            const orderDetails = req.body;
            console.log('hit the post')
            const result = await myOrderCollection.insertOne(orderDetails);
            res.json(result);
        })



        //DELETE API
        app.delete('/deleteOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myOrderCollection.deleteOne(query);
            res.json(result);
        })



        // UPDATE API
        app.put('/approve/:id', async (req, res) => {
            const id = req.params.id;
            const approvedOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: approvedOrder.status
                },
            };
            const result = await myOrderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}

// client.connect((err) => {


//     const serviceCollection = client.db('destination').collection('services')
//     const myOrderCollection = client.db('destination').collection('orders');


//     // get api
//     app.get('/services', async (req, res) => {
//         const cursor = serviceCollection.find({})
//         const services = await cursor.toArray();
//         res.send(services)
//     })


//     // get single service
//     app.get('/services/:id', async (req, res) => {
//         const id = req.params.id
//         console.log('getting specific id', id)
//         const query = { _id: ObjectId(id) }
//         const service = await serviceCollection.findOne(query)
//         res.json(service)
//     })

//     // add service
//     app.post("/services", async (req, res) => {
//         const service = req.body
//         console.log('hit the post', service)
//         const result = await serviceCollection.insertOne(service);
//         console.log(result);
//         res.json(result)
//     });





//     // GET API (get all orders)
//     app.get('/orders', async (req, res) => {
//         const query = {};
//         const cursor = myOrderCollection.find(query);
//         const orders = await cursor.toArray();
//         res.send(orders);
//     })

//     // GET API (get orders by email)
//     app.get('/myOrders/:email', async (req, res) => {
//         const email = req.params.email;
//         const query = { email: email };
//         const cursor = await orderCollection.find(query);
//         const myOrders = await cursor.toArray();
//         res.send(myOrders);
//     })



//     // POST API
//     app.post('/placeOrder', async (req, res) => {
//         const orderDetails = req.body;
//         const result = await myOrderCollection.insertOne(orderDetails);
//         res.json(result);
//     })



//     // DELETE API 
//     app.delete('/deleteOrder/:id', async (req, res) => {
//         const id = req.params.id;
//         const query = { _id: ObjectId(id) };
//         const result = await myOrderCollection.deleteOne(query);
//         res.json(result);
//     })



//     // UPDATE API
//     app.put('/approve/:id', async (req, res) => {
//         const id = req.params.id;
//         const approvedOrder = req.body;
//         const filter = { _id: ObjectId(id) };
//         const options = { upsert: true };
//         const updateDoc = {
//             $set: {
//                 status: approvedOrder.status
//             },
//         };
//         const result = await myOrderCollection.updateOne(filter, updateDoc, options);
//         res.json(result);
//     })




// });



run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('tourism server app is running')
})

app.listen(port, () => {
    console.log('tourism server running at port', port)
})
