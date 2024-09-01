import sharp from "sharp";
import User from "../models/user.model.js"; // .js is must in import
import cloudinary from "../utils/cloudinary.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

export const addnewpost = async (req, res) => {
    try {


        // ✨1. user from token
        const authorid = req.id;  // Assuming req.id contains the author ID
        



        // ✨2. image from pc_file_explorer using multer
        const image = req.file;   
        if (!image) {
            return res.status(400).json({ message: "No image file uploaded", success: false });
        }
        // Optimize image
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();
        
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);




        // ✨3. caption
        const caption = req.body.caption; // Assuming caption is directly a property in req.body
        if (!caption) {
            return res.status(400).json({ message: "Caption is required", success: false });
        }




        // Create the post
        const post = await Post.create({
            author: authorid,
            image: cloudinaryResponse.secure_url,
            caption,
            likes: [],
            comments: []
        });
    


        // Update user posts
        const user = await User.findById(authorid);
        if (user) {
            if (!user.posts) {
                user.posts = [];
            }
            user.posts.push(post._id);
            await user.save();
        }

        // Populate post author details
        await post.populate({ path: "author", select: "-password" })

        // Return success response
        return res.status(200).json({
            message: "Post Added Successfully",
            success: true,
            post
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            success: false,
            error: error.message
        });
    }
};


export const getuserposts=async(req,res)=>{
    try {
         const posts = await Post.find({author:req.id}).sort({createdAt:-1})  // posts ko increasing order mein sort krdo
                                                       .populate({path:"author",select:'username profilePicture'})  //post ke uper author ki --dp and name show krne
                                                       .populate({path:"comments"}).sort({createdAt:-1})
                                                                                   .populate({path:"author",select:'username profilePicture'}) 
         return res.status(200).json({
            success:true,
            posts
         })
    } catch (error) {
        console.log(error);
    }
}

export const getallposts=async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1})
                                       .populate({path:"author",select:'username profilePicture'})
                                       .populate({path:"comments"}).sort({createdAt:-1})
                                                                   .populate({path:"author",select:'username profilePicture'})

        return res.status(200).json({
            success:true,
            posts
        })
    } catch (error) {
        console.log(error);
    }
}

export const like_or_dislike=async(req,res)=>{
    try {
        const who_like_dislike_id = req.id;
       const post_id = req.params.id;
   
       const who_like_dislike_user = await User.findById(who_like_dislike_id);
       const post = await Post.findById(post_id);
       if(!post)
       {
          return res.status(404).json({
            message:"Post not found",
            success:false,
          })
       }
   
       //post ke "likes" mein--- who_like_dislike_id ---add or remove krenge
   
       const islike = await post.likes?.includes(who_like_dislike_id);
   
       if(islike)
       {
           //already like---so we click post for dislike(remove who_like_dislike_id) 
           await post.updateOne({_id:post_id},{$pull:{likes: who_like_dislike_id}});
           await post.save();
   
           return res.status(200).json({
               message:"Post disliked",
               success:true
           })
   
       }else{
           //not like---so we click for post for like(add who_like_dislike_id) only once(unique--need of set)
           await post.updateOne({_id:post_id},{$addtoset:{likes: who_like_dislike_id}});
           await post.save();
   
           return res.status(200).json({
               message:"Post liked",
               success:true
           })
    }
    } catch (error) {
        console.log(error);
    }

}

export const addcomment=async(req,res)=>{
    try {
             const who_comment_id = req.id;
         const post_id = req.params.id;
     
         const who_comment_user = await User.findById(who_comment_id);
         const post = await Post.findById(post_id);
     
         const {text} = req.body;
     
         if(!text)
         {
            return res.status(400).json({
             message:"text is required",
             success:false
            })
         }
     
         const comment = await Comment.create({
             content:text,
             commentedBy:who_comment_id,
             commentedAt:post_id
            }).populate({path:"author",select:'username,profilePicture'});
     
         post.comments.push(comment_id);
         await post.save();
     
         return res.status(200).json({
             message:"post is commented",
             success:true,
             comment
         })
    } catch (error) {
        console.log(error);
    }
}


export const getcomments_ofpost=async(req,res)=>{
    try {
        const post_id = req.params.id;
    
        const comments_of_post = await Comment.find({createdAt:post_id}).populate({path:"author",select:'username,profilePicture'});
    
        if(!comments_of_post)
        {
            return res.status(404).json({
                message:"No comments found for this post",
                success:false
            })
        }
     
        return res.status(200).json({
           success:true,
           comments_of_post
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletepost=async(req,res)=>{

   try {
    // 1️⃣post to delete
        const post_id = req.params.id;
        const post = await Post.findById(post_id);
        if(!post)
        {
            return res.status(404).json({
                message:"Post not found",
                success:false
            })
        }
    
        // user is auth to delete post
        const who_delete_id = req.id;
        if(Post.author.toString() !== who_delete_id)
        {
            return res.status(404).json({
                message:"User not authenticated",
                success:false
            })
        }
    
        await Post.findByIdAndDelete(post_id);

    // 2️⃣delete post in user dbs
        let who_delete_user = findById(who_delete_id);
        who_delete_user.posts = await who_delete_user.posts.filter(id=>id.toString()!==post_id);
        await who_delete_user.save();

    // 3️⃣delete all post related comments from dbs
        await Comment.deleteMany({createdAt:post_id})

    return res.status(200).json({
        message:"Post deleted",
        success:true
    })

    
   } catch (error) {
     console.log({me})
   }

}


export const bookmark_post=async(req,res)=>{
    try {
        const post_id = req.params.id;
       const post = await Post.findById(post_id);
       if(!post)
       {
        return res.status(404).json({
            message:"Post not found",
            success:false
        })
       }

       const user_id = req.id;
       const user = await User.findById(user_id);
       if(!user)
       {
        return res.status(404).json({
            
            message:"unauthorized User",
            success:false
        })
       }

       const isbookmark = await user.bookmarks?.includes(post_id);
       if(isbookmark)
       {
        //we click to remove bookmark
        await user.updateOne({_id:user_id},{$pull:{bookmarks:post_id}});
        await user.save();

        return res.status(200).json({
            type:'unsaved',
            message:"Post removed from bookmarks",
            success:true
        })
       }
       else{
         //we click to  bookmark
         await user.updateOne({_id:user_id},{$addtoset:{bookmarks:post_id}});
         await user.save();
 
         return res.status(200).json({
            type:'saved',
             message:"Post added to bookmarks",
             success:true
         })
        }
    } catch (error) {
        console.log(error);
    }
}