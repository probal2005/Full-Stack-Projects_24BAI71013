import { useSelector } from "react-redux";
import {
  selectTotalPosts,
  selectPublishedPosts,
  selectDraftPosts,
  selectTotalLikes,
} from "../selectors/postSelectors";

function Statistics() {
  const totalPosts = useSelector(selectTotalPosts);
  const publishedPosts = useSelector(selectPublishedPosts);
  const draftPosts = useSelector(selectDraftPosts);
  const totalLikes = useSelector(selectTotalLikes);

  return (
    <div className="stats">
      <h2>Statistics</h2>

      <p>Total Posts: {totalPosts}</p>

      <p>Published Posts: {publishedPosts.length}</p>

      <p>Draft Posts: {draftPosts.length}</p>

      <p>Total Likes: {totalLikes}</p>
    </div>
  );
}

export default Statistics;