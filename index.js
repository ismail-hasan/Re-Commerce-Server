const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken');
const { query } = require('express');
const app = express()
const port = process.env.PORT || 5000

// midleWare 
app.use(cors())
app.use(express.json())

// mongodb 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w4v9v80.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const auhtHeader = req.headers.authorization
    if (!auhtHeader) {
        return res.status(401).send("unauthorize access")
    }
    const token = auhtHeader.split(" ")[1]
    jwt.verify(token, process.env.USER_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: "forbidden access" })
        }
        req.decoded = decoded
        next()
    })

}

async function run() {

    const laptopCollection = client.db('laptop').collection('allLaptop')
    const bookingCollection = client.db('laptop').collection('bookings')
    const userCollection = client.db('laptop').collection('users')
    try {
        // user jwt token
        app.get('/jwt', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await userCollection.findOne(query)
            if (result) {
                const token = jwt.sign({ email }, process.env.USER_TOKEN, { expiresIn: '1d' })

                return res.send({ accessToken: token })
            }
            res.status(401).send({ accessToken: "" })
        })

        // register user save api 
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.get('/allusers', async (req, res) => {
            const query = {}
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/allusers/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/user', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        app.get('/userroll', async (req, res) => {
            const id = req.query.roll
            console.log(id)
            const query = { roll: id }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })


        app.put('/allusers/varify/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    isvarify: "varify"
                }
            }
            const result = await userCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

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

        app.get("/book", async (req, res) => { //veriryJWT
            const email = req.query.email
            // const decodedEmail = req.decoded.email
            // if (email !== decodedEmail) {
            //     return res.status(403).send({ message: "forbeddin access" })
            // }

            const query = { userEmail: email }
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

        app.get('/laptop', async (req, res) => {
            const email = req.query.email
            console.log(email)
            const query = { email: email }
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

        app.patch('/advites/:id', async (req, res) => {
            const id = req.params.id;
            // const query = { advatise: true }

            //
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    advatise: true
                }
            }
            //
            const result = await laptopCollection.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.get('/advites', async (req, res) => {
            const query = { advatise: true }
            const result = await laptopCollection.find(query).toArray()
            res.send(result)
        })

        // report product api 
        app.get('/report', async (req, res) => {
            const query = { report: true }
            const result = await laptopCollection.find(query).toArray()
            res.send(result)
        })

        app.delete('/report/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await laptopCollection.deleteOne(query)
            res.send(result)
        })
        app.put('/report/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    report: true
                }
            }
            const result = await laptopCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })


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