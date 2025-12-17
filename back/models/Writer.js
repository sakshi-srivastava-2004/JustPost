const mongoose = require("mongoose");

const WriterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    genre: { type: String, required: true },  // Genre(s) the writer specializes in
    username: {type:String,required:true},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Writer", WriterSchema);
