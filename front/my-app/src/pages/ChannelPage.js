// new code

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ChannelPage = () => {
    const { channelId } = useParams(); // Get channelId from URL params
    const navigate = useNavigate(); // Initialize navigate for redirection
    
    // State variables to store works and form inputs
    const [works, setWorks] = useState([]);
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("thrill");  // Default genre
    const [type, setType] = useState("story");     // Default type
    const [content, setContent] = useState("");
    const [error, setError] = useState(null); // Error handling state

    // Fetch works for the channel
    const fetchWorks = useCallback(async () => {
        const token = localStorage.getItem("token");
        console.log("Channel ID:", channelId); // Check channelId // Retrieve authentication token
        try {
            const response = await axios.get(`http://localhost:5000/api/work/${channelId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWorks(response.data.works); // Store retrieved works in state
        } catch (error) {
            console.error("Error fetching works:", error);
        }
    }, [channelId]);

    // Fetch works when the component mounts or channelId changes
    useEffect(() => {
        fetchWorks();
    }, [fetchWorks]);

    // Handle adding a new work
    const handleAddWork = async () => {
        if (!title.trim() || !content.trim()) {
            setError("Title and content cannot be empty.");
            return;
        }

        const token = localStorage.getItem("token"); // Retrieve authentication token
        try {
            const response = await axios.post("http://localhost:5000/api/works", 
                { channelId, title, genre, type, content }, // Send work details to server
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                // Reset form fields on successful submission
                setTitle("");
                setGenre("thrill");
                setType("story");
                setContent("");
                navigate("/writer-dashboard"); // Redirect after success
            } else {
                setError("Failed to add work. Try again.");
            }
        } catch (error) {
            console.error("Error adding work:", error);
            setError("Error adding work. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", background: "#f4f4f4", borderRadius: "8px" }}>
            {/* Page Title */}
            <h2 style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Channel Works</h2>

            {/* Form for adding a new work */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold" }}>Add Work</h3>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
                />
                {/* Dropdown to select type of work */}
                <select 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
                >
                    <option value="story">Story</option>
                    <option value="poem">Poem</option>
                    <option value="music lyrics">Music Lyrics</option>
                    <option value="shayari">Shayari</option>
                </select>
                {/* Dropdown to select genre */}
                <select 
                    value={genre} 
                    onChange={(e) => setGenre(e.target.value)} 
                    style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
                >
                    <option value="thrill">Thrill</option>
                    <option value="romantic">Romance</option>
                    <option value="mystery">Mystery</option>
                    <option value="fantasy">Fantasy</option>
                </select>
                <textarea 
                    placeholder="Content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    rows="4"
                    style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px", resize: "none" }}
                />
                <button 
                    onClick={handleAddWork} 
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#007BFF")}
                >
                    Add Work
                </button>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            </div>

            {/* List of Works */}
            {/* <h3 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>Works in this Channel</h3>
            {works.length > 0 ? (
                works.map((work) => (
                    <div key={work._id} style={{ padding: "15px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
                        <h4 style={{ margin: "5px 0", color: "#333" }}>{work.title}</h4>
                        <p style={{ color: "#666" }}><strong>Genre:</strong> {work.genre} | <strong>Type:</strong> {work.type}</p>
                        <p style={{ color: "#555" }}>{work.content}</p>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: "center", color: "#777" }}>No works found. Add some to get started!</p>
            )} */}




 {/* List of Works */}
 <h3 style={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", marginTop: "20px" }}>
                Works in this Channel
            </h3>
            {works.length > 0 ? (
                works.map((work) => (
                    <div 
                        key={work._id} 
                        onClick={() => navigate(`/work-details/${work._id}`)}
                        style={{
                            padding: "15px",
                            marginBottom: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            backgroundColor: "#f9f9f9",
                            cursor: "pointer",
                            transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor="pink"}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"}
                    >
                        <h4 style={{ margin: "5px 0", color: "#333" }}>{work.title}</h4>
                        <p style={{ color: "#666" }}>
                            <strong>Genre:</strong> {work.genre} | <strong>Type:</strong> {work.type}
                        </p>
                        <p style={{ color: "#555" }}>{work.content.substring(0, 100)}...</p>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: "center", color: "#777" }}>No works found. Add some to get started!</p>
            )}
        


        </div>
    );
};

export default ChannelPage;
