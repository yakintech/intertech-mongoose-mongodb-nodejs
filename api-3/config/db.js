const { MongoClient } = require("mongodb");

const url = 'mongodb+srv://bilginc_user:MAeJxxNPxj2Izfgq@cluster0.jcus0vv.mongodb.net/';
const client = new MongoClient(url);

const dbConnect = () => {
    client.connect().then(() => {
        console.log("Connected to MongoDB")
    }
    ).catch((error) => {
        console.log(error)
    }
    )
}

const dbName = 'sample_mflix';
const db = client.db(dbName);

var moviesCollection = db.collection("movies")
var usersCollection = db.collection("users")

module.exports = {
    dbConnect,
    moviesCollection,
    usersCollection
}
