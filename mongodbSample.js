const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb+srv://bilginc_user:MAeJxxNPxj2Izfgq@cluster0.jcus0vv.mongodb.net/';
const client = new MongoClient(url);

// Database Name
const dbName = 'sample_mflix';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);

    //   const moviesCollection = db.collection('movies');
    //   const movies = await moviesCollection.find().toArray() // select * from movies

    const userCollection = db.collection("users");
    const users = await userCollection.find().toArray(); // select * from users

    //select * from users where name like '%a%'
    // const users2 = await userCollection.find({ name: /a/ }).toArray();
    // console.log(users2)

    const insertResult = await userCollection.insertOne({ name: "Çağatay2", email: "cagatay3.yildiz@mail.com", points: [1, 3, 5] })

    
    const deleteResult = await userCollection.deleteOne({email: "cagatay3.yildiz@mail.com"})
    // console.log(deleteResult)

    // delete by object id
    const deleteResult2 = await userCollection.deleteOne({ _id: ObjectId("60b4c6f2c2e8e7f6b8d9f7b8") })



    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());



    //list collections, insert, delete