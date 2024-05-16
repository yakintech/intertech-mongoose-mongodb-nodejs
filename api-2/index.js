//express paketi benim bir web server ayağa kaldırmama yarar
//mongoose paketi kod tarafından mongodb yönetimi (collection oluşturma, sorgular ve tüm işlemleri yapmamı sağlar)
const express = require("express")
const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const { v4: uuidv4 } = require('uuid');



const app = express();

app.use(express.json())
app.use(express.static("public")) // public klasörünü statik olarak yayınlıyorum
app.use(express.urlencoded({ extended: true })) // artık formdan gelen verileri okuyabilirim
app.use(fileUpload())

app.use(cors());

// connection stringde bulunan "/" sonrası bir database i ifade eder. blogdb
mongoose.connect("mongodb+srv://bilginc_user:MAeJxxNPxj2Izfgq@cluster0.jcus0vv.mongodb.net/blogdb")
    .then(() => {
        console.log("Connected to MONGODB!")
    })
    .catch(err => console.log("ERROR", err))


//her blog yazısının bir userı var diyorum!
const blogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // bu şekilde bogPost tablosu(!) ile user tablosunu birbirine bağladım!
        ref: "User"
    }
},
    {
        timestamps: true
    })


const userSchema = new Schema({
    email: {
        type: String, // alanın tipi
        unique: true, // alanın unique olmasını sağlar(benzersiz)
        required: true, // alanın boş geçilemeyeceğini belirtir
        default: "test@mail.com" // alanın default değerini belirtir
    },
    profilePic: {
        type: String,
        default: "https://via.placeholder.com/150"
    },
    address: [{
        type: Schema.Types.ObjectId,
        ref: "Address"
    }]
},
    {
        timestamps: true
    })

const addressSchema = new Schema({
    name: String,
    street: String,
    city: String
})

const categorySchema = new Schema({
    name:String,
    description: String,
    //image binary
    image: Buffer
})


const BlogPostModel = mongoose.model("BlogPost", blogPostSchema)
const UserModel = mongoose.model("User", userSchema)
const AddressModel = mongoose.model("Address", addressSchema)
const CategoryModel = mongoose.model("Category", categorySchema)

categorySchema.pre("save", function (next) {
    console.log("Category will be saved!")
    next()
})

app.post("/api/category", async (req, res) => {


    try {
        //image dosyası yoksa hata ver
        if (!req.files) {
            return res.status(400).json({ message: "Image is required!" })
        }

        //image dosyasını binary olarak kaydediyorum
        let newCategory = new CategoryModel({
            name: req.body.name,
            description: req.body.description,
            image: req.files.categoryImage.data
        })

        await newCategory.save();
        console.log("Category saved!")
        return res.json(newCategory)
    } catch (error) {
        return res.status(500).json(error)
    }
}
)

app.get("/api/category", async (req, res) => {
    try {
        let categories = await CategoryModel.find();
        return res.json(categories)
    } catch (error) {
        return res.status(500).json(error)
    }
}
)



app.get("/api/users", async (req, res) => {
    try {
        var users = await UserModel.find().populate("address"); // select * from Users
        return res.json(users)
    } catch (error) {
        return res.status(500).json(error)
    }
})

app.post("/api/users", async (req, res) => {

    console.log("BODY", req.body)
    console.log("FILES", req.files)
    //kullanıcı eklerken dışarıdan gelen profil fotoğrafını sunucuya kaydediyorum. pathini de tabloya kaydediyorum

    var profilePicPath = "";
    if (req.files) {
        var profilePic = req.files.profilePic;
        profilePicPath = uuidv4().toString() + `${profilePic.name}`
        //public foldera kaydediyorum
        await profilePic.mv(`./public/${profilePicPath}`)
    }

    try {
        var newUser = new UserModel({
            email: req.body.email,
            address: req.body.addresses,
            profilePic: profilePicPath
        })

        await newUser.save();
        return res.status(201).json(newUser)
    } catch (error) {
        return res.status(500).json(error)
    }

})


app.get("/api/blogpost", async (req, res) => {
    //populate ile user tablosundaki bilgileri de alıyorum. ayrıca user tablosununu da address tablosu ile bağladım!
    var blogposts = await BlogPostModel.find().populate("user").populate({
        path: "user",
        populate: ["address"],
      });
  

    return res.json(blogposts)
})

app.post("/api/blogpost", async (req, res) => {

    try {
        var newBlogPost = new BlogPostModel({
            title: req.body.title,
            content: req.body.content,
            user: req.body.user
        })

        await newBlogPost.save();
        return res.status(201).json(newBlogPost);
    } catch (error) {
        return res.status(500).json(error)
    }

})


app.get("/api/address", async (req, res) => {
    try {
        let addresses = await AddressModel.find();
        return res.json(addresses)
    } catch (error) {
        return res.status(500).json(error)
    }
})

app.post("/api/address", async (req, res) => {
    try {
        let newAddress = new AddressModel({
            street: req.body.street,
            name: req.body.name,
            city: req.body.city
        })

        await newAddress.save();
        return res.json(newAddress);

    } catch (error) {
        return res.status(500).json(error)
    }
})


app.listen(3002, () => {
    console.log("Server is running...")
})


//Content Types
// application/json, application/x-www-form-urlencoded, multipart/form-data


//mongoose middleware sample