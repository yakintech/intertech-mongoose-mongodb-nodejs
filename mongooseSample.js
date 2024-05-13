const mongoose = require("mongoose")
const { Schema } = require("mongoose");


mongoose.connect("mongodb+srv://bilginc_user:MAeJxxNPxj2Izfgq@cluster0.jcus0vv.mongodb.net/ecommercedb")
    .then(() => {
        console.log("Connected!!");

        //mongoose ile db ye yeni bir product ekliyorum
        // var product = new productModel({
        //     name: "Huawei-2",
        //     price: 3300,
        //     points: [4, 3, 5],
        //     code:"4fe1"
        // })

        // product.save()

        //select * from products
        // productModel.find()
        //     .then(data => {
        //         console.log(data);
        //     })

        //delete by id
        // productModel.findByIdAndDelete("6642045eef80934fad7913c4")

        //içeriye uygun ilk datayı bulup siliyor
        // productModel.findOneAndDelete({ name: "Samsung" })
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err))


        // productModel.updateOne({ name: "Huawei" }, { price: 5000 })
        // .then(res => console.log(res))

        // productModel.updateMany({ name: "Samsung" }, { price: 5000 })


        productModel.findById("6641f995393c25fa4094d026")
        .then(res => console.log(res))
        



    })

//Db de product adında bir tablo oluşturacağım. Öncelikle onun dizaynını oluşturuyorum.
const productSchema = new Schema({
    name: String, //metinsel tipler => nvarchar
    price: Number, // float, decimal, int gibi tipler number olarak tutulur
    points: [], // array
    country: {
        type: String,
        default: "Türkiye"
    },
    code: {
        type: String,
        required: true
    }
},
    {
        timestamps: true //createdAt ve updatedAt adında iki tane kolon ekler. Ekleme ve güncelleme operasyon tarihlerini otomatik ekler
    }
)

//bu dizaynı oluşturduğum product tablosuna bağlıyorum
const productModel = mongoose.model("Product", productSchema)

