const { usersCollection } = require("../config/db")


const userController = {
    add: async (req, res) => {

        try {
            let newUSer = req.body;
            if (newUSer != null && newUSer != undefined || Object.keys(newUSer).length > 0) {
                usersCollection.insertOne(newUSer)
                return res.status(201).json(newUSer)
            }
            else {
                return res.status(400).json({ "message": "Invalid user object!" })
            }
        } catch (error) {
            return res.status(500).json(error);

        }

    }

}

module.exports = {
    userController
}