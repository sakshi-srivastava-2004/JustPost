import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WriterDashboard = () => {
    const [channels, setChannels] = useState([]);
    const [channelName, setChannelName] = useState("");
    const [channelDesc, setChannelDesc] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch channels when the component mounts
    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
            setError("User not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("http://localhost:5000/api/channels", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                console.log(response.data.channels);
                setChannels(response.data.channels); // Update state with channels
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching channels:", error);
            setError("Failed to fetch channels. Please try again.");
            setLoading(false);
        }
    };

    // Handle channel creation
    const handleCreateChannel = async () => {
        if (!channelName.trim() || !channelDesc.trim()) {
            setError("Channel name and description cannot be empty.");
            return;
        }

        const token = localStorage.getItem("token");
        console.log("Token:", token);
        if (!token) {
            console.log('Token not found');
            setError("User not authenticated. Please log in.");
            return;
        }

        setError(null); // Reset error

        try {
            const response = await axios.post(
                "http://localhost:5000/api/channels",
                { name: channelName, description: channelDesc },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log(response.data);
            if (response.data.success) {
                setChannelName(""); // Reset form fields
                setChannelDesc("");
                fetchChannels(); // Refresh channel list after creation
                // navigate('/channel-page');
                navigate("/writer-dashboard");
            } else {
                setError(response.data.message || "Error creating channel.");
            }
        } 
        // catch (error) {
        //     console.error("Error creating channel:", error);
        //     setError("Error creating channel. Please try again.");
        // }

        catch (error) {
            console.error("Error creating channel:", error);
            if (error.response) { // More detailed error information
                setError(error.response.data.message || "Error creating channel.");
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
            } else {
                setError("Error creating channel. Please try again.");
            }
        }
    };
// handle viewing channel and works

const handleViewWorks = (channelId) => {
    navigate(`/channel/${channelId}`);
};

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center", color: "#333" }}>Writer Dashboard</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Channel Name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={channelDesc}
                    onChange={(e) => setChannelDesc(e.target.value)}
                    style={{
                        padding: "10px",
                        fontSize: "16px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                    }}
                />
                <button
                    onClick={handleCreateChannel}
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
                    Create Channel
                </button>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            </div>

            <h3 style={{ textAlign: "center", color: "#555" }}>Your Channels</h3>
            {loading ? (
                <p style={{ textAlign: "center", color: "#777" }}>Loading channels...</p>
            ) : channels.length > 0 ? (
                channels.map((channel) => (
                    <div
                        key={channel._id}
                        style={{
                            padding: "15px",
                            marginBottom: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <h4 style={{ margin: "5px 0", color: "#333" }}>{channel.name}</h4>
                        <p style={{ color: "#666" }}>{channel.description}</p>
                        <button
                            onClick={() => handleViewWorks(channel._id)}
                            style={{
                                padding: "8px 12px",
                                fontSize: "14px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                            onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
                        >
                            View & Add Works
                        </button>
                    </div>
                ))
            ) : (
                <p style={{ textAlign: "center", color: "#777" }}>No channels found. Create one to get started!</p>
            )}
        </div>
    );
};

export default WriterDashboard;
