const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    writerId: { type: mongoose.Schema.Types.ObjectId, ref: "Writer", required: true },
});

module.exports = mongoose.model("Channel", ChannelSchema);
