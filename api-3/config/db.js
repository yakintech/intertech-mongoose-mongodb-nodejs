const { MongoClient } = require("mongodb");

require('dotenv').config()


const url = process.env.MONGODB_CONNECTION

const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,  // Bağlantı havuzundaki maksimum bağlantı sayısı
    socketTimeoutMS: 45000, // Soket işlem süresi aşımını belirler
});

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
