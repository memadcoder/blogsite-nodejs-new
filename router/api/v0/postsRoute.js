const express = require("express");

const postController = require("../../../controller/api/v0/postsController");
const isAuthAdmin = require("../../../auth/v0/isAuth");


const router = express.Router();

router.get("/", postController.getPosts);
router.post("/",isAuthAdmin, postController.createPost);
router.get("/featured", postController.getFeaturedPost);
router.get("/latest",postController.getLatestPost);
router.get("/recents",postController.getRecentPosts);
router.delete("/:entryId",isAuthAdmin,postController.deleteById);
router.put("/:entryId",isAuthAdmin,postController.updatePost);
router.get("/:entryId",postController.getPostById);



module.exports = router;
