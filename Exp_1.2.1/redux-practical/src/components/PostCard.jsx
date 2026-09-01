import { useDispatch } from "react-redux";
import {
  deletePost,
  togglePublished,
} from "../features/postSlice";

function PostCard({ post }) {
  const dispatch = useDispatch();

  return (
    <div className="post-card">
      <h3>{post.title}</h3>

      <p>
        <strong>Platform:</strong> {post.platform}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {post.published ? "Published" : "Draft"}
      </p>

      <button
        onClick={() => dispatch(togglePublished(post.id))}
      >
        Toggle Status
      </button>

      <button
        onClick={() => dispatch(deletePost(post.id))}
      >
        Delete
      </button>
    </div>
  );
}

export default PostCard;