const express = require('express');
const { dbConnect, usersCollection } = require('./config/db');
const app = express();
const jwt = require("jsonwebtoken")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

let tokenKey = "secretKey"

const moviesRouter = require('./routes/moviesRouter')
const userRouter = require('./routes/userRouter')

app.use(express.json());
app.use(cors())

//rate limit config. 5 request in 1 minute
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5
})

app.use(limiter)



//jwt control bearer token
//Bearer qrwmlqrwmlqwr
app.use((req, res, next) => {

    //kullanıcı token almak için geliyorsa bu isteği geçir
    if (req.path == "/token") {
        return next();
    }

    try {
        if (req.headers.authorization) {
            let token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, tokenKey, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized" })
                }
                else {
                    return next();
                }
            }
            )
        }
        else {
            return res.status(401).json({ message: "Unauthorized" })
        }
    } catch (error) {
        return res.status(500).json(error)
    }
}
)


dbConnect();



app.use("/api/movies", moviesRouter);
app.use("/api/user", userRouter);


//kullanıcı adı(email) ve şifre doğruysa token oluşturulacak. Token 5 dklık olacak.
app.post("/token", async (req, res) => {
    let { email, password } = req.body;
    if (email && password) {
        //kullanıcı var mı kontrol et
        var user = await usersCollection.findOne({ "email": email, "password": password });

        if (user) {
            jwt.sign({ email: email }, tokenKey, { expiresIn: "1m" }, (err, token) => {
                if (err) {
                    return res.status(500).json(err)
                }
                else {
                    return res.status(200).json({ token: token })
                }
            }
            )
        }
        else {
            return res.status(404).json({ message: "User not found!" })
        }
    }
    else {
        return res.status(400).json({ message: "Email and password are required!" })
    }
}
)


app.listen(3000, () => {
    console.log("Server is running...")
})