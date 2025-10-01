const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Lead = require("../models/lead.model");
const SalesAgent = require("../models/salesAgent.model");
const Comments = require("../models/comment.model");

// ✅ Create New Comment
async function createNewComment(newComment) {
  try {
    const { lead, author, commentText, createdAt } = newComment;

    if (!mongoose.Types.ObjectId.isValid(lead)) {
      return { error: "Invalid Lead ID format." };
    }
    if (!mongoose.Types.ObjectId.isValid(author)) {
      return { error: "Invalid Sales Agent ID format." };
    }

    const leadExists = await Lead.findById(lead);
    if (!leadExists) {
      return { error: `Lead with ID '${lead}' not found.` };
    }

    const salesAgentExists = await SalesAgent.findById(author);
    if (!salesAgentExists) {
      return { error: `Sales Agent with ID '${author}' not found.` };
    }

    if (!commentText || typeof commentText !== "string") {
      return { error: "commentText is required and must be a string." };
    }

    const comment = new Comments({
      lead,
      author,
      commentText,
      createdAt: createdAt || Date.now(),
    });

    const savedComment = await comment.save();
    return savedComment;
  } catch (error) {
    console.log("Failed to create comment:", error);
  }
}

router.post("/:id/comments", async (req, res) => {
  try {
    const newComment = {
      lead: req.params.id,
      author: req.body.author,
      commentText: req.body.commentText,
      createdAt: req.body.createdAt,
    };

    const result = await createNewComment(newComment);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json({
      id: result._id,
      commentText: result.commentText,
      author: result.author,
      createdAt: result.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create comment." });
  }
});

//Get all comments by perticular lead.
async function getAllCommentsById(leadId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return { error: "Invalid Lead ID format." };
    }

    const leadExists = await Lead.findById(leadId);
    if (!leadExists) {
      return { error: `Lead with ID '${leadId}' not found.` };
    }

    const comments = await Comments.find({lead: leadId});
    console.log(comments);
  } catch (error) {
    console.log("Failed to fetch comments", error);
  }
}

module.exports = { router, getAllCommentsById };