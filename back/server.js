const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Middleware for authentication
const authenticate = (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader); // Log entire header

    const token = authHeader?.split(" ")[1]; // Extract Bearer token
    console.log("Extracted Token:", token); // Log extracted token

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token Data:", decoded); // Log decoded token payload
        req.writerId = decoded.id;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error); // Log error details
        return res.status(401).json({ success: false, message: "Invalid token." });
    }
};


// Function to update .env file
const updateEnvFile = (key, value) => {
    const envPath = "./.env";
    let envContents = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
    if (!envContents.includes(`${key}=`)) {
        fs.appendFileSync(envPath, `\n${key}=${value}`);
        console.log(`${key} added to .env file`);
    }
};

// Ensure JWT_SECRET is set in .env
if (!process.env.JWT_SECRET) {
    const newSecret = crypto.randomBytes(32).toString("hex");
    updateEnvFile("JWT_SECRET", newSecret);
    process.env.JWT_SECRET = newSecret;
}

// Models
const Writer = require("./models/Writer");
const Composer = require("./models/Composer");
const Channel = require("./models/Channel");
const Work = require("./models/Work");

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(bodyParser.json());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Database Connections
const writerDB = mongoose.createConnection("mongodb://localhost:27017/writerDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const composerDB = mongoose.createConnection("mongodb://localhost:27017/composerDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const channelDB = mongoose.createConnection("mongodb://127.0.0.1:27017/channelDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const workDB = mongoose.createConnection("mongodb://localhost:27017/workDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

writerDB.on("connected", () => console.log("Connected to writerDB"));
composerDB.on("connected", () => console.log("Connected to composerDB"));
channelDB.on("connected", () => console.log("Connected to channelDB"));
workDB.on("connected", () => console.log("Connected to workDB"));


channelDB.on("connected", () => console.log("Successfully connected to channelDB"));
channelDB.on("error", (err) => console.error(" channelDB Connection Error:", err));
channelDB.on("disconnected", () => console.warn(" channelDB Disconnected!"));




const WriterModel = writerDB.model("Writer", Writer.schema);
const ComposerModel = composerDB.model("Composer", Composer.schema);
const ChannelModel = channelDB.model("Channel", Channel.schema);
const WorkModel = workDB.model("Work", Work.schema);

// Register Writer model with workDB connection:
const WriterModelForWorkDB = workDB.model("Writer", Writer.schema);

// Signup - Writer
app.post("/api/signup/writer", async (req, res) => {
    try {
        const { name, email, username, password, genre } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newWriter = new WriterModel({ name, email, username, password: hashedPassword, genre });
        await newWriter.save();
        res.json({ success: true, message: "Writer registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to register writer" });
    }
});

// Login - Writer
app.post("/api/login/writer", async (req, res) => {
    try {
        const { username, password } = req.body;
        const writer = await WriterModel.findOne({ username });
        if (writer && (await bcrypt.compare(password, writer.password))) {
            const token = jwt.sign({ id: writer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            console.log("Generated token:",token);
            console.log("Writer ID:",writer._id);

            res.json({ success: true, message: "Login successful", token, writerId: writer._id });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Login error" });
    }
});

// Get writer's channels
app.get("/api/channels", authenticate, async (req, res) => {
    try {
        const channels = await ChannelModel.find({ writerId: req.writerId });
        res.json({ success: true, channels });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching channels" });
    }
});


// Create a Channel


app.post("/api/channels", authenticate, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        console.log("Request Body:", req.body);  // Debugging
        console.log("Writer ID:", req.writerId);
        if (!name || !description) {
            return res.status(400).json({ success: false, message: "Channel name and description are required." });
        }
        const writerId = req.writerId; // Extract writer ID from the token

       // Check if channel with the same name already exists
        const existingChannel = await ChannelModel.findOne({ name:req.body.name }).maxTimeMS(5000); // 5-second timeout
        if (existingChannel) {
            return res.status(400).json({ success: false, message: "Channel already exists." });
        }

        // Create new channel
        const newChannel = new ChannelModel({
            name,
            description,
            writerId: req.writerId // Associate the writer with the channel
        });

        await newChannel.save();
        console.log("Channel Saved:", newChannel);
        
        res.status(200).json({ success: true, message: "Channel created successfully.", channel: newChannel });
     } 
    // catch (error) {
    //     console.error("Error creating channel:", error);
    //     res.status(500).json({ success: false, message: "Error creating channel. Please try again." });
    // }

    catch (error) {
        console.error("Error creating channel:", error);
        console.error("Error details:", error.stack); // This will show you the exact line of code causing the error
        if (error.response) { // Check for detailed server error
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
        } else if (error.request) { // Check if a request was made but no response was received
            console.error("Request:", error.request);
        } else { // Something else happened while setting up the request
            console.error("Error message:", error.message);
        }
        res.status(500).json({ success: false, message: "Error creating channel. Please try again." });
    }
});

// add work


app.post("/api/works", authenticate, async (req, res) => {
    try {
        const { channelId, title, genre, type, content } = req.body;
        const writerId = req.writerId; // Get the writer ID from authentication

        // 1. Validate Input (Important):
        if (!channelId || !title || !genre || !type || !content) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields (channelId, title, genre, type, content)" 
            });
        }

        // 2. Check if channelId is a valid ObjectId:
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid channelId" 
            });
        }

        const newWork = new WorkModel({
            channelId,
            title,
            genre,
            type,
            content,
            author: writerId  // Associate the work with the writer
        });

        // 3. Save the Work (with proper error handling):
        const savedWork = await newWork.save(); // Get the saved document

        res.status(201).json({ // 201 Created is more appropriate
            success: true, 
            message: "Work added", 
            work: savedWork // Send back the complete saved work
        });

    } catch (error) {
        console.error("Error adding work:", error);

        if (error.name === 'ValidationError') { // Mongoose validation error
            return res.status(400).json({ success: false, message: error.message });
        } else if (error.code === 11000 && error.keyPattern && error.keyPattern.title === 1) { // Check for duplicate title
            return res.status(400).json({ success: false, message: "Work with this title already exists." });
        }

        res.status(500).json({ success: false, message: "Error adding work. Please try again later." });
    }
});

// Get works of a channel
app.get("/api/work/:channelId", authenticate, async (req, res) => {
    try {
        const channelId = req.params.channelId;

        // 1. Validate channelId (Crucial):
        if (!channelId) {
            return res.status(400).json({ success: false, message: "Channel ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(channelId)) {
            return res.status(400).json({ success: false, message: "Invalid Channel ID" });
        }

        // 2. Query the database (with error handling):
        const works = await WorkModel.find({ channelId: channelId })
    .populate({ // Use an object for more options
        path: 'author', // The path to populate (the 'author' field)
        select: 'name' // The fields to include in the populated document
    });// Populate author details

        if (!works) { // Check if works are found
            return res.status(404).json({ success: false, message: "No works found for this channel." });
        }

        res.status(200).json({ success: true, works }); // 200 OK

    } catch (error) {
        console.error("Error fetching works:", error);

        if (error.name === 'CastError') { // Mongoose CastError (invalid ObjectId)
            return res.status(400).json({ success: false, message: "Invalid Channel ID" });
        }

        res.status(500).json({ success: false, message: "Error fetching works. Please try again later." });
    }
});


// get work for composer
app.get("/works", async (req, res) => {
    try {
      const { genre, type } = req.query;
      console.log("Received genre:", genre);
      console.log("Received type:", type);
  
      if (!genre || !type) {
        return res.status(400).json({ error: "Genre and Type are required" });
      }
  
      const works = await WorkModel.find({ genre, type }); // Populating writer's name
      console.log("Works found:", works);
      res.json(works);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });


  // get writer profile

  app.get("/writers/:id", async (req, res) => {
    try {
      const writer = await Writer.findById(req.params.id).populate("works"); // Assuming 'works' is an array in the schema
      if (!writer) {
        return res.status(404).json({ message: "Writer not found" });
      }
      res.json(writer);
    } catch (error) {
      console.error("Error fetching writer:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  


// fetch work

// Fetch work details
app.get('/api/works/:workId', authenticate, async (req, res) => { // Renamed to /api/works/:workId
    try {
        const workId = req.params.workId;

        if (!mongoose.Types.ObjectId.isValid(workId)) {
            return res.status(400).json({ success: false, message: "Invalid Work ID" });
        }

        const work = await WorkModel.findById(workId);

        if (!work) {
            return res.status(404).json({ success: false, message: 'Work details not found' });
        }

        res.json({ success: true, work }); // Added success property for consistency

    } catch (error) {
        console.error("Error fetching work details:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// edit work by writers

// Update a writer's work
router.put("/api/works/:workId", authenticate, async (req, res) => {
    const { workId } = req.params;
    const { content } = req.body;
    
    try {
        const updatedWork = await WorkModel.findByIdAndUpdate(
            workId,
            { content },
            { new: true } // Return updated document
        );
        console.log("PUT request received for workId:", workId);
        console.log("Request body:", req.body);
        if (!updatedWork) {
            return res.status(404).json({ message: "Work not found" });
        }

        res.json({ message: "Work updated successfully", work: updatedWork });
    } catch (error) {
        console.error("Error updating work:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;


// Fetch all Writers
app.get("/api/writers", async (req, res) => {
    try {
        const writers = await WriterModel.find({}, "name email genre");
        res.status(200).json({ writers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching writers" });
    }
});

// composers

// Signup - Composer
app.post("/api/signup/composer", async (req, res) => {
    try {
        const { name, email, mobileNo, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newComposer = new ComposerModel({ name, email, mobileNo, username, password: hashedPassword });
        await newComposer.save();
        res.json({ success: true, message: "Composer registered successfully!" });
    } catch (error) {
        console.error("Error in /api/signup/composer:", error);
        res.status(500).json({ success: false, message: "Failed to register composer" });
    }
});

// composer login


app.post("/api/login/composer", async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt for username:", username);
        const composer = await ComposerModel.findOne({ username });
        console.log("Composer found:", composer);

        if (!composer) {
            console.log("Composer not found for username:", username);
            return res.status(404).json({ success: false, message: "Composer not found" });
        }

        if (await bcrypt.compare(password, composer.password)) {
            const token = jwt.sign({ id: composer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            console.log("Generated token:", token);
            console.log("Composer ID:", composer._id);

            res.json({ success: true, message: "Login successful", token, composerId: composer._id });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Login error" });
    }
});

// Fetch all Composers
app.get("/api/composers", async (req, res) => {
    try {
        const composers = await ComposerModel.find({}, "name email");
        res.status(200).json({ composers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching composers" });
    }
});

// Start the server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
