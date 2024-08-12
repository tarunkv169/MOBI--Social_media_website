import mongoose from "mongoose";

commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    commentedBy:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"User",
        required:true
    },
    commentedAt:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"Post",
        required:true
    }
},{timestamps:true})

Comment = mongoose.model("Comment",commentSchema);
export default Comment;