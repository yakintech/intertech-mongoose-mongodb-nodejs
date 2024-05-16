const { ObjectId } = require("mongodb");
const { moviesCollection } = require("../config/db")



const moviesController = {

    getAll: async (req, res) => {
        let limit = 100;
        let searchTitle = ""
        let year = 0
        let page = 1

        if (req.query.limit != undefined && req.query.limit != null) {
            limit = parseInt(req.query.limit)
        }
        if (req.query.title != undefined && req.query.title != null) {
            searchTitle = req.query.title
        }

        if (req.query.year != undefined && req.query.year != null) {
            year = parseInt(req.query.year)
        }

        if (req.query.page != undefined && req.query.page != null) {
            page = parseInt(req.query.page)
        }

        //page, limit, searchTitle, year
        let skip = (page - 1) * limit;
        
        var movies = await moviesCollection.find({ "title": { "$regex": searchTitle }, "year": { "$gte": year } }).skip(skip).limit(limit).toArray();

        return res.json(movies)
    },
    getById: async (req, res) => {

        try {
            var id = new ObjectId(req.params.id);

            var movie = await moviesCollection.findOne({ "_id": id });
            console.log(movie)
            if (movie)
                return res.json(movie)
            else
                return res.status(404).json({ "message": req.params.id + " was not found!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    },
    deleteById: async (req, res) => {

        try {
            var id = new ObjectId(req.params.id);
            var result = await moviesCollection.deleteOne({ "_id": id })

            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json(error);
        }

    },
    add: (req, res) => {

        try {
            let newMovie = req.body;
            if(newMovie != null && newMovie != undefined || Object.keys(newMovie).length > 0){
                moviesCollection.insertOne(newMovie);
                return res.status(201).json(newMovie);
            }
            else{
                return res.status(400).json({"message": "Invalid movie object!"})
            }
                
        } catch (error) {
            return res.status(500).json(error);
        }

    },
    update: (req, res) => {

        try {
            let id = new ObjectId(req.params.id);
            let updatedMovie = req.body;

            if(updatedMovie == null || updatedMovie == undefined || Object.keys(updatedMovie).length == 0){
                return res.status(400).json({"message": "Invalid movie object!"})
            }

            moviesCollection.updateOne({"_id": id}, {$set: updatedMovie});
            return res.status(200).json(updatedMovie);
        } catch (error) {
            return res.status(500).json(error);
        }

    }

}


module.exports = {
    moviesController
}