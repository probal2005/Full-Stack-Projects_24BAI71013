import "./App.css";

import AddPost from "./components/AddPost";
import PostList from "./components/PostList";
import Statistics from "./components/Statistics";

function App() {
  return (
    <div className="container">
      <h1>Redux Toolkit Performance Optimization</h1>

      <Statistics />

      <hr />

      <AddPost />

      <hr />

      <PostList />
    </div>
  );
}

export default App;