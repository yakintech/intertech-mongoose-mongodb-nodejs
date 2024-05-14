const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())


const url = 'mongodb+srv://bilginc_user:MAeJxxNPxj2Izfgq@cluster0.jcus0vv.mongodb.net/';
const client = new MongoClient(url);

client.connect()
const dbName = 'sample_mflix';
const db = client.db(dbName);

//Kullanıcı ana dizine ( www.cagatay.com gibi) geldiğinde kullanıcıya "Hello Express" adında bir string return ediyorum!
app.get('/', function (req, res) {
    return res.send("Hello Express!!")
})

//get all movies
app.get('/api/movies', async function (req, res) {
    var moviesCollection = db.collection("movies")

    //get 100 films from movies collection
    var movies = await moviesCollection.find({}).limit(100).toArray()
    return res.json(movies)
})

//get movie by ID
app.get('/api/movies/:id', async function (req, res) {

    try {
        var id = new ObjectId(req.params.id);
        var moviesCollection = db.collection("movies")
        var movie = await moviesCollection.findOne({ "_id": id })

        if (movie != null && movie != undefined)
            return res.json(movie)
        else
            return res.status(404).json({ "message": "Movie was not found!" })
    } catch (error) {
        return res.status(500).json({ "message": "Id parameter is not objectId!" })
    }

})

//delete movie by id
app.delete('/api/movies/:id', async function(req,res){

    try {
        var id = new ObjectId(req.params.id)
        var moviesCollection = db.collection("movies")
        var deleteResult = await moviesCollection.deleteOne({"_id": id})
        return res.json(deleteResult)
        
    } catch (error) {
        return res.status(500).json(error)
    }

})







app.listen(8080, () => {
    console.log("Server is running...")
})