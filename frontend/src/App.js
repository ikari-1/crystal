import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import PostDetails from "./pages/postDetails/PostDetails";
import PostList from "./pages/postList/PostList";
import CreatePost from "./pages/createPost/CreatePost";
import Profile from "./pages/profile/Profile";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={user ? <Navigate to="/postList"/> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/postList" element={<PostList />} />
        <Route path="/profile/:username" element={<Profile />} />
        {/* <Route path="/write" element={<Write />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/post/:postId" element={<Single />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
