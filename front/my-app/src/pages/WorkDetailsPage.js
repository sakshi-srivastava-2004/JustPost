import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WorkDetailsPage = () => {
    const { workId } = useParams();
    const [work, setWork] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");

    useEffect(() => {
        const fetchWorkDetails = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/api/works/${workId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWork(response.data.work);
                setEditedContent(response.data.work.content);
            } catch (err) {
                console.error("Error fetching work details:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkDetails();
    }, [workId]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedContent(work.content); // Reset content if canceled
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:5000/api/works/${workId}`,
                { content: editedContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setWork(response.data.work);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating work:", err);
            setError(err);
        }
    };

    if (isLoading) return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>Error: {error.message}</p>;
    if (!work) return <p style={{ textAlign: "center", color: "#888" }}>Work not found.</p>;

    return (
        <div style={{
            maxWidth: "800px",
            margin: "50px auto",
            padding: "30px",
            background: "#f8f0e3",
            borderRadius: "15px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
            fontFamily: "serif",
            lineHeight: "1.7",
        }}>
            <h2 style={{ textAlign: "center" }}>{work.title}</h2>
            <p style={{ textAlign: "center", fontSize: "18px" }}><strong>Type:</strong> {work.type} | <strong>Genre:</strong> {work.genre}</p>

            <div style={{
                marginTop: "20px",
                padding: "20px",
                borderRadius: "10px",
                background: "#fff",
                boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.08)",
                whiteSpace: "pre-wrap",
            }}>
                {isEditing ? (
                    <textarea
                        style={{ width: "100%", height: "200px", fontSize: "18px", padding: "10px" }}
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                ) : (
                    <p style={{ fontSize: "19px", color: "#444", lineHeight: "1.8" }}>{work.content}</p>
                )}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} style={{ marginRight: "10px", padding: "10px 20px", background: "green", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                            Save
                        </button>
                        <button onClick={handleCancel} style={{ padding: "10px 20px", background: "gray", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={handleEdit} style={{ padding: "10px 20px", background: "blue", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
};

export default WorkDetailsPage;
