import { useSelector } from "react-redux";
import PostCard from "./PostCard";

function PostList() {
  const posts = useSelector((state) => state.posts.posts);

  return (
    <div>
      <h2>Posts</h2>

      {posts.length === 0 ? (
        <p>No Posts Available</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
}

export default PostList;