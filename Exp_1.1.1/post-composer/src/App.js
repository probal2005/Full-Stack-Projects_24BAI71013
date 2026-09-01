import { useState } from "react";

function App() {
  const [platform, setPlatform] = useState("Twitter");
  const [post, setPost] = useState("");

  const limits = {
    Twitter: 280,
    LinkedIn: 3000,
    Instagram: 2200,
    Facebook: 63206,
  };

  const limit = limits[platform];
  const isExceeded = post.length > limit;

  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
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
        Developed by Probal Dhali (24BAI71013) Experiment 1.1.1
      </div>

      <div
        style={{
          width: "650px",
          margin: "auto",
          backgroundColor: "#ffffff",
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
          <option>Facebook</option>
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
            resize: "none",
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
            Character Limit Exceeded!
          </p>
        ) : (
          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            Ready to Post
          </p>
        )}

        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Save Draft
        </button>
      </div>
    </div>
  );
}

export default App;