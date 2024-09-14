import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js";   // .js is must in import
import { addcomment, addnewpost, bookmark_post, deletepost, getallposts, getcomments_ofpost, getuserposts, like_or_dislike } from "../controllers/post.controller.js"; //.js is must in import
import upload from "../middlewares/multer.js";  //.js is must in import
const router = express.Router();

// 1.addnewpost,2.getuserposts,3.getallposts--4.like_dislike_post
// 5.addcomment,6.get_comments_ofpost
// 7.deletepost,8.bookmarkpost

router.route("/addpost").post(isAuthenticated,upload.single('image'),addnewpost);
router.route("/userpost/all").get(isAuthenticated,getuserposts);
router.route("/all").get(isAuthenticated,getallposts);
router.route("/:id/like_or_dislike").get(isAuthenticated,like_or_dislike);
router.route("/:id/comment").post(isAuthenticated,addcomment);
router.route("/:id/comment/all").get(isAuthenticated,getcomments_ofpost);
router.route("/delete/:id").delete(isAuthenticated,deletepost);          // need of delete
router.route("/:id/bookmark").post(isAuthenticated,bookmark_post);

export default router;