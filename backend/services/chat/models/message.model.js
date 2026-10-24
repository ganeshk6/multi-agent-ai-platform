import mongoose from "mongoose";
import Conversation from "./conversation.model.js";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Conversation
    },
    role:{
        type:String,
        enum:["user", "assistant"]
    },
    content:String,
    images:[String],
}, {
    timestamps: true
})

const Message= mongoose.model("Message", messageSchema)
export default Message