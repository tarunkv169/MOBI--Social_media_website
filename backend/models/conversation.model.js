import mongoose from "mongoose";

conversationSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Subject.Types.ObjectId,
        ref:"User"
    }],
    messages:[{
        type:mongoose.Subject.Types.ObjectId,
        ref:"Message"
    }]
},{timestamps:true})

Conversation = mongoose.model("Conversation",conversationSchema);
export default Conversation;