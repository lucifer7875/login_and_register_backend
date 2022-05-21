import express from "express"

import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect(
    "mongodb://localhost:27017/loginRegisterDB",
    {
        useNewUrlParser: true,
        useUnifiedtopology: true
    },
    () => {
        console.log("DB connected")
    })

// const personal_Info = new mongoose.Schema({})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    personalInfo: {},
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res) => {                                   // URL BASE POST APP
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login successfull", user: user })
            } else {
                res.send({ message: "password did not match" })
            }
        } else {
            res.send({ message: "User not found" })
        }
    })
})

app.post("/register", (req, res) => {                                // URL BASE POST APP
    const { name, email, password } = req.body
    User.findOne({ email: email }, (err, user) => {                  // check email
        if (user) {
            res.send({ message: "user already registerd" })
        } else {
            const user = new User({
                name: name,
                email: email,
                password: password
            })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered , plese Login " })
                }
            })
        }
    })

})

// personal_info post route

app.post("/personal_info", async (req, res) => {
    const { user_id } = req.body

    console.log(req.body)
    delete req.body.user_id

    User.updateOne({ _id: user_id }, { $set: { personalInfo: req.body } })
        .then(
            (result, err) => {
                return res.status(200).json({ data: result, message: "details updated" })
            }
        )
})


app.listen(9002, () => {
    console.log("BE started at port 9002")
})