import mongoose from "mongoose";

userSchema = new mongoose.Schema(
    {
      username:{
        type:String,
        required:true,
        unique:true
      },
      email:{
        type:String,
        required:true,
        unique:true
      },
      password:{
        type:String,
        required:true
      },
      profilePicture:{
        type:String,
        default:""
      },
      bio:{
        type:String,
        default:""
      },
      gender:{
        type:String,
        enum:["male","female"]
      },
      followers:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"User"
      },
      following:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"User"
      },
      posts:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"Post"
      },
      bookmarks:{
        type:mongoose.Subject.Types.ObjectId,
        ref:"Post"
      }
    },{timestamps:true})

User = mongoose.model("User",userSchema);
export default User;