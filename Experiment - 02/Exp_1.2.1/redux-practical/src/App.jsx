import "./App.css";
import AddPost from "./components/AddPost";
import PostList from "./components/PostList";

function App() {
  return (
    <div className="container">
      <h1>Redux Toolkit - Post Manager</h1>

      <AddPost />

      <hr />

      <PostList />
    </div>
  );
}

export default App;