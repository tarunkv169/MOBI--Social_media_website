import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    commentedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    commentedAt:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    }
},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema);
export default Comment;