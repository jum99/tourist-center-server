const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//  middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fodu2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));

async function run() {
    try {
        await client.connect();
        const database = client.db('touristCenter');
        const resortsCollection = database.collection('resorts');
        const bookingsCollection = database.collection('bookings');


        // POST API 
        app.post('/addResorts', async (req, res) => {
            const resort = req.body;

            // const resort = {
            //     "name": "Sarah Resort",
            //     "area": "About 260km Wide Area",
            //     "booked": "Booked 350times in last 24 hours",
            //     "description": "Sarah Resort is a unique resort with modern facilities which is situated at Rajabari in Gazipur.It includes Water sports, cycling, boating.",
            //     "image": "https://blog.flyticket.com.bd/wp-content/uploads/2019/06/sarah-resort-768x514.jpg"
            // }

            const result = await resortsCollection.insertOne(resort);
            // console.log(result);
            res.json(result);
        });

        // GET API 
        app.get("/allResorts", async (req, res) => {
            const result = await resortsCollection.find({}).toArray();
            res.send(result);
        });

        // DELETE RESORT 
        app.delete("/deleteResort/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await resortsCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // ADD BOOKING 
        app.post("/addBookings", async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        });

        // GET BOOKINGS 
        app.get("/manageAllBookings", async (req, res) => {
            const result = await bookingsCollection.find({}).toArray();
            res.send(result);
        });

        //   DELETE BOOKINGS 
        app.delete("/deleteBooking/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await bookingsCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        //   MY BOOKINGS 
        app.get("/myBookings/:email", async (req, res) => {
            const result = await bookingsCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my server');
});

app.listen(port, () => {
    console.log('Running server on port', port);
})