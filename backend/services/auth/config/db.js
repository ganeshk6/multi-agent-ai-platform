import mongoose from "mongoose"

const connectdb = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB connected");
    }catch(err){
        console.log("DB connection err "+err);
    }
}

export default connectdb