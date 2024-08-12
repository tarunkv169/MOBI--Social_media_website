import mongoose from "mongoose";

messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"User"
    },
    recieverId:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    }
},{timestamps:true})

Message = mongoose.model("Message",messageSchema);
export default Message;