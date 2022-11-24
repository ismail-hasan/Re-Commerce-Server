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
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    const laptopCollection = client.db('laptop').collection('allLaptop')

    try {
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