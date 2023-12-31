const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const cors = require("cors");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongooseConnect = require("./configs/mongoDB.connect");
require("dotenv").config()

app.use(cors());
app.use(express.json())

const authMiddleware = require("./middlewares/auth.middleware");

const authRouter = require("./routes/auth.routes")
app.use("/", authRouter)

const usersRouter = require("./routes/users.routes");
app.use("/user", authMiddleware, usersRouter)

const booksRouter = require("./routes/books.routes");
app.use("/books", authMiddleware, booksRouter)


app.listen(8000, (err)=>{
    if(err){
        console.error(err)
        return
    }
    console.log("server running on port: ", 8000)
    mongooseConnect()
})