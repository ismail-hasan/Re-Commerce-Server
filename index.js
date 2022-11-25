const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// midleWare 
app.use(cors())
app.use(express.json())


//data base
// username : laptop
// password : Qnhp6hXeWicFvgBb
// mongodb 

const uri = "mongodb+srv://laptop:Qnhp6hXeWicFvgBb@cluster0.w4v9v80.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const laptopCollection = client.db('laptop').collection('allLaptop')
    const bookingCollection = client.db('laptop').collection('bookings')

    try {
        // user booking laptop api 
        app.post('/bookings', async (req, res) => {
            const booking = req.body
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

        app.get('/bookings', async (req, res) => {
            const query = {}
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
        })

        // all laptop find to database 

        app.post('/allLaptop', async (req, res) => {
            const laptop = req.body
            const result = await laptopCollection.insertOne(laptop)
            res.send(result)
        })

        app.get('/alllaptops', async (req, res) => {
            const query = {}
            const result = await laptopCollection.find(query).toArray()
            res.send(result)
        })

        // one  laptops 

        app.get('/alllaptops/:brand', async (req, res) => {
            const id = req.params.brand
            const query = { brand: id }
            const result = await laptopCollection.find(query).toArray()
            res.send(result)
        })

        // app.get('/alllaptops', async (req, res) => {
        //     const id = req.query.id
        //     const query = { _id: ObjectId(id) }
        //     const result = await laptopCollection.findOne(query)
        //     res.send(result)
        // })


    }
    finally {

    }
}
run().catch(e => console.log(e))



//local server 
app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server port is ${port}`)
})