import express from "express";
import { editprofile, follow_or_unfollow, get_suggested_users, getprofile, login, logout, signup } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

//1. func which contains-(req.body)------> use post in routes
//   func which not contains-(req.body)------> use get in routes

//2.  func which took id from params ----> use route(/:id/getprofile)

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
//:id is must---as in getprofile() we took user profile from "params id"
router.route("/:id/profile").get(isAuthenticated,getprofile);

//for uploadation of file multer is use (we define multer storage in middlewares)
//profile ko edit kr rhe hain to profile ke awge edit dala
router.route("/profile/edit").post(isAuthenticated,upload.single("profilePicture"),editprofile);
router.route("/getSuggestedUsers").get(isAuthenticated,get_suggested_users);

//:id is must---as in getprofile() we took user profile from "params id"
router.route("/followOrunfollow/:id").post(isAuthenticated,follow_or_unfollow);

export default router;