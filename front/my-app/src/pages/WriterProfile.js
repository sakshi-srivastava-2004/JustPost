import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const WriterProfile = () => {
  const { writerId } = useParams();
  const [writer, setWriter] = useState(null);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWriterProfile = async () => {
      setLoading(true);
      try {
        const writerResponse = await axios.get(`http://localhost:5000/writers/${writerId}`);
        const worksResponse = await axios.get(`http://localhost:5000/works?author=${writerId}`);
        setWriter(writerResponse.data);
        setWorks(worksResponse.data);
      } catch (error) {
        console.error("Error fetching writer profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWriterProfile();
  }, [writerId]);

  const truncateContent = (content, wordLimit = 20) => {
    const words = content.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : content;
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {loading ? (
        <p>Loading profile...</p>
      ) : writer ? (
        <>
          <h1 style={{ textAlign: "center", color: "#333" }}>{writer.name}'s Profile</h1>
          <p style={{ textAlign: "center", color: "#666" }}>Bio: {writer.bio}</p>
          <h2>Works</h2>
          {works.length > 0 ? (
            works.map((work) => (
              <div
                key={work._id}
                style={{
                  padding: "15px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h3 style={{ margin: "5px 0", color: "#333" }}>{work.title}</h3>
                <p style={{ color: "#666" }}>{truncateContent(work.content)}</p>
                <p>
                  <strong>Genre:</strong> {work.genre}
                </p>
                <p>
                  <strong>Type:</strong> {work.type}
                </p>
              </div>
            ))
          ) : (
            <p>No works available.</p>
          )}
        </>
      ) : (
        <p>Writer not found.</p>
      )}
    </div>
  );
};

export default WriterProfile;
