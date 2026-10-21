import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/db.js"
import router from "./routes/auth.route.js"
dotenv.config()

const port = process.env.PORT

const app = express()
app.use(express.json())
app.use("/", router)

app.get('/', (req, res)=>{
    res.json({"message": "Hello from auth"});
})

app.listen(port, ()=>{
    console.log("service started at port "+port);
    connectdb();
})