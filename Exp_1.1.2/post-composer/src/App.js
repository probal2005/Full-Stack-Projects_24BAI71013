import { useState } from "react";
function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");
  const [drafts, setDrafts] = useState([]);
  const limits = {
    Twitter: 280,
    LinkedIn: 3000,
    Instagram: 2200,
  };
  const limit = limits[platform];
  const isExceeded = post.length > limit;
  const saveDraft = () => {
    if (post.trim() === "") {
      alert("Please write something first!");
      return;
    }
    setDrafts([...drafts, post]);
    setPost("");
  };
  const editDraft = (index) => {
    setPost(drafts[index]);
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
  };
  const deleteDraft = (index) => {
    const updatedDrafts = drafts.filter((_, i) => i !== index);
    setDrafts(updatedDrafts);
  };
  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      {/* Top-left corner developer credit */}
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "20px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#2c3e50",
        }}
      >
        Developed by Probal Dhali (24BAI71013) Experiment 1.1.2
      </div>
      
      <div
        style={{
          backgroundColor: "white",
          width: "650px",
          margin: "auto",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2c3e50",
            marginBottom: "30px",
          }}
        >
          Social Media Post Composer
        </h1>
        <label>
          <b>Select Platform</b>
        </label>
        <br />
        <br />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        >
          <option>Twitter</option>
          <option>LinkedIn</option>
          <option>Instagram</option>
        </select>
        <br />
        <br />
        <label>
          <b>Write Your Post</b>
        </label>
        <br />
        <br />
        <textarea
          rows="6"
          placeholder="Type your post here..."
          value={post}
          onChange={(e) => setPost(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "2px solid #ccc",
            fontSize: "16px",
          }}
        ></textarea>
        <br />
        <br />
        <p
          style={{
            fontWeight: "bold",
            color: isExceeded ? "red" : "#2c3e50",
          }}
        >
          Characters: {post.length} / {limit}
        </p>
        {isExceeded ? (
          <p
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            Character limit exceeded!
          </p>
        ) : (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            Ready to post
          </p>
        )}
        <button
          onClick={saveDraft}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "10px",
          }}
        >
          Save Draft
        </button>
        <hr style={{ margin: "30px 0" }} />
        <h2> Saved Drafts</h2>
        {drafts.length === 0 ? (
          <p>No drafts available.</p>
        ) : (
          drafts.map((draft, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#f8f9fa",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "15px",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <p>{draft}</p>
              <button
                onClick={() => editDraft(index)}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                ✏ Edit
              </button>
              <button
                onClick={() => deleteDraft(index)}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default App;
