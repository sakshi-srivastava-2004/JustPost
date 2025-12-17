const mongoose = require("mongoose");

const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Writer", required: true },
  genre: { 
    type: String, 
    enum: ["thrill", "suspense", "romantic", "comedy", "sad","fantasy"], 
    required: true ,
    lowercase:true
  },
  type: { 
    type: String, 
    enum: ["story", "poem", "music lyrics", "shayari"], 
    required: true,
    lowercase:true 
  },
  content: { type: String, required: true },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true }
});

const Work = mongoose.model("Work", workSchema);

module.exports = Work;
