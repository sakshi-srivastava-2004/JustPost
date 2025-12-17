const mongoose = require("mongoose");

const ComposerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Composer", ComposerSchema);
