const fs = require("fs");
const comments = require("../models/comment.model");

const jsonData = fs.readFileSync("./data/comments.json", "utf-8");
const commentsData = JSON.parse(jsonData);

async function seedComments() {
  try {
    for (const commentData of commentsData) {
      const newComment = new comments({
        lead: commentData.lead,
        author: commentData.author,
        commentText: commentData.commentText,
        createdAt: commentData.createdAt,
      });
      await newComment.save();
    }
    console.log("Comments data successfully seeded ✅")
  } catch (error) {
    console.log("Error seeding comments data: ", error);
  }
}
module.exports = { seedComments };
