const express = require('express');
const app = express();
const cors = require('cors');
port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
app.use(cors());
app.use(express.json());
require('dotenv').config();
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ppycm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('hot-onion');
        const foodCollection = database.collection('foods');
        const cartCollection = database.collection('cart');
        console.log('db connected')
        //Post api
        app.post('/addtoCart', async (req, res) => {
            const data = req.body;
            console.log(data);
            const cursor = await cartCollection.insertOne(data)
            res.json(cursor);
        })
        //get cart item
        //get cart item
        app.get('/Cart', async (req, res) => {
            const cursor = cartCollection.find({});
            // console.log(req)
            const cart = await cursor.toArray();
            res.send(cart);
        })

        //get api
        app.get('/foods', async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const cursor = foodCollection.find({});
            let foods;
            const count = await cursor.count();
            if (page) {
                foods = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                foods = await cursor.toArray();
            }
            res.send({ count, foods });
        })
        app.delete('/Cart', async (req, res) => {
            const result = await cartCollection.deleteMany({});
            console.log('deleted cart')
            res.send(result)
        })
        //delete api
        app.delete('/Cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = req.body;

            const result = await cartCollection.deleteOne(cursor)
            res.send(result);
            console.log('deleted', id, result);
        })
    }
    finally {

    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    console.log('running get');
    res.send('hello there')
});
app.listen(port, () => {
    console.log('running port', port)
})