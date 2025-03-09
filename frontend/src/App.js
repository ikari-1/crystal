import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Post_details from "./pages/post_details/Post_details";
import PostList from "./pages/postList/PostList";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post_details" element={<Post_details />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/postList" element={<PostList />} />
        {/* <Route path="/profile/:username" element={<Profile />} /> */}
        {/* <Route path="/write" element={<Write />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/post/:postId" element={<Single />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
