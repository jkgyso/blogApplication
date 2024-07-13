const express = require('express');
const commentController = require('../controllers/comment');

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post('/addComment/:postId', commentController.addComment);
router.get("/getComments/:postId", commentController.getComments);
router.delete("/deleteComment/:id", verify, verifyAdmin, commentController.deleteComment);

module.exports = router;