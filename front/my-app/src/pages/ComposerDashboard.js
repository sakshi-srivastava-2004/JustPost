import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ComposerDashboard = () => {
  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/works?genre=${encodeURIComponent(genre || "all")}&type=${encodeURIComponent(type || "all")}`
      );
      setWorks(response.data);
      setFilteredWorks(response.data);
    } catch (error) {
      console.error("Error fetching works", error);
    } finally {
      setLoading(false);
    }
  }, [genre, type]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const handleGenreChange = (selectedGenre) => {
    setGenre(selectedGenre);
  };

  const handleTypeChange = (selectedType) => {
    setType(selectedType);
  };

  useEffect(() => {
    let filtered = works;
    if (genre) {
      filtered = filtered.filter((work) => work.genre === genre);
    }
    if (type) {
      filtered = filtered.filter((work) => work.type === type);
    }
    setFilteredWorks(filtered);
  }, [genre, type, works]);

  const truncateContent = (content, wordLimit = 20) => {
    const words = content.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : content;
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Composer Dashboard</h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label style={{ fontSize: "16px", fontWeight: "bold" }}>Filter by Genre: </label>
        <select
          onChange={(e) => handleGenreChange(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginLeft: "10px" }}
        >
          <option value="">All</option>
          <option value="thrill">Thrill</option>
          <option value="suspense">Suspense</option>
          <option value="romantic">Romantic</option>
          <option value="comedy">Comedy</option>
          <option value="sad">Sad</option>
          <option value="fantasy">Fantasy</option>
        </select>
        <label style={{ fontSize: "16px", fontWeight: "bold", marginLeft: "20px" }}>Filter by Type: </label>
        <select
          onChange={(e) => handleTypeChange(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginLeft: "10px" }}
        >
          <option value="">All</option>
          <option value="story">Story</option>
          <option value="poem">Poem</option>
          <option value="music lyrics">Music Lyrics</option>
          <option value="shayari">Shayari</option>
        </select>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : filteredWorks.length > 0 ? (
          filteredWorks.map((work) => (
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
              <button
                onClick={() => navigate(`/writer/${work.author}`)}
                style={{
                  padding: "8px 12px",
                  fontSize: "14px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Contact Writer
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#777" }}>No works available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ComposerDashboard;
