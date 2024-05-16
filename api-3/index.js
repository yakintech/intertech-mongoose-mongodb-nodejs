const express = require('express');
const { dbConnect } = require('./config/db');
const app = express();

const moviesRouter = require('./routes/moviesRouter')

app.use(express.json());
dbConnect();



app.use("/api/movies", moviesRouter);




app.listen(3000, () => {
    console.log("Server is running...")
})