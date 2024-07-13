const express = require("express");
const blogController = require("../controllers/blog");

const { verify, verifyAdmin } = require('../auth');

const router = express.Router();

router.post("/addPost", verify, blogController.addPost);
router.get("/getBlogs", blogController.getBlogs);
router.get("/getBlog/:id", blogController.getBlog);
router.patch("/updatePost/:id", verify, blogController.updatePost);
router.delete("/deleteOwnPost/:id", verify, blogController.deleteOwnPost);
router.delete("/deletePost/:id", verify, verifyAdmin, blogController.deletePost);


module.exports = router;