const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dc9spgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftCollection = client.db('artisanDB').collection('craftItems');

 
    app.get('/craftItems',async(req,res)=>{
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/craftItem/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await craftCollection.findOne(query);
        res.send(result);
    })

    // My crafts
    app.get('/craftItems/:userEmail',async(req,res)=>{
        const result = await craftCollection.find({userEmail:req.params.userEmail}).toArray();
        res.send(result);
    })

    app.post('/craftItems',async(req,res)=>{
        const newCraft = req.body;
        const result = await craftCollection.insertOne(newCraft);
        res.send(result);
    })

    // update
    app.put('/craftItem/:id',async(req,res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedArt = req.body;
        const art = {
            $set: {
                item_name: updatedArt.item_name,
                subcategory_Name: updatedArt.subcategory_Name,
                short_description: updatedArt.short_description,
                price: updatedArt.price,
                rating: updatedArt.rating,
                customization: updatedArt.customization,
                processing_time: updatedArt.processing_time,
                stockStatus: updatedArt.stockStatus,
                image: updatedArt.image
            }
        }
        const result = await craftCollection.updateOne(filter,art,options);
        res.send(result);
    })
     
    // delete
    app.delete('/craftItems/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await craftCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("Artisan Haven server is Running");
})

app.listen(port,()=>{
    console.log(`Artisan haven is running on port : ${port}`);
})