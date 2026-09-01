import { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../features/postSlice";

function AddPost() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Facebook");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    dispatch(
      addPost({
        id: Date.now(),
        title,
        platform,
        likes: 0,
        published: false,
      })
    );

    setTitle("");
    setPlatform("Facebook");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option>Facebook</option>
        <option>Instagram</option>
        <option>LinkedIn</option>
        <option>Twitter</option>
      </select>

      <button type="submit">Add Post</button>
    </form>
  );
}

export default AddPost;