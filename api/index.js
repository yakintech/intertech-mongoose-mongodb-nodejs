const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())


const url = 'mongodb+srv://bilginc_user:MAeJxxNPxj2Izfgq@cluster0.jcus0vv.mongodb.net/';
const client = new MongoClient(url);

client.connect().then(() => {
    console.log("Connected to MongoDB")
}
).catch((error) => {
    console.log(error)
}
)
const dbName = 'sample_mflix';
const db = client.db(dbName);

//Kullanıcı ana dizine ( www.cagatay.com gibi) geldiğinde kullanıcıya "Hello Express" adında bir string return ediyorum!
app.get('/', function (req, res) {
    return res.send("Hello Express!!")
})

//get all movies
app.get('/api/movies', async function (req, res) {

    let limit = 100;
    let searchTitle = ""
    let year = 0

    if (req.query.limit != undefined && req.query.limit != null) {
        limit = parseInt(req.query.limit)
    }
    if (req.query.title != undefined && req.query.title != null) {
        searchTitle = req.query.title
    }

    if (req.query.year != undefined && req.query.year != null) {
        year = parseInt(req.query.year)
    }

    var moviesCollection = db.collection("movies")
    //get 100 films from movies collection
    var movies = await moviesCollection.find({ "title": { "$regex": searchTitle }, "year": { "$gte": year } }).limit(limit).toArray()
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
app.delete('/api/movies/:id', async function (req, res) {

    try {
        var id = new ObjectId(req.params.id)
        var moviesCollection = db.collection("movies")
        var deleteResult = await moviesCollection.deleteOne({ "_id": id })
        return res.json(deleteResult)

    } catch (error) {
        return res.status(500).json(error)
    }

})


app.post("/api/users", function (req, res) {

    try {
        let newUser = req.body;

        if (newUser == null || newUser == undefined || Object.keys(newUser).length == 0) {
            return res.status(400).json({ "message": "User object is required!" })
        }

        const userCollection = db.collection("users")
        userCollection.insertOne(newUser).then(() => {
            return res.status(201).json({ "message": "User added successfully!" })
        })
            .catch((err) => {
                return res.status(500).json(err)
            })


    } catch (error) {
        return res.status(500).json(error)
    }

})

app.get("/api/users", function (req, res) {

    const userCollection = db.collection("users")
    userCollection.find({}).toArray().then((users) => {
        return res.json(users)
    })
        .catch((err) => {
            return res.status(500).json(err)
        })

})

//delete user by id
app.delete("/api/users/:id", function (req, res) {
    try {
        var id = new ObjectId(req.params.id)
        var usersCollection = db.collection("users")
        var deleteResult = usersCollection.deleteOne({ "_id": id })
        return res.json(deleteResult)
    } catch (error) {
        return res.status(500).json(error)
    }
})


app.get("/api/comments/:movieId", function (req, res) {

    let movieId = req.params.movieId
    movieId = new ObjectId(movieId)
    const commentsCollection = db.collection("comments")
    commentsCollection.find({ "movie_id": movieId }).toArray().then((comments) => {
        return res.json(comments)
    }
    ).catch((err) => {
        return res.status(500).json(err)
    })

})


app.listen(8080, () => {
    console.log("Server is running...")
})