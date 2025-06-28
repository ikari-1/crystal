import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import PostDetails from "./pages/postDetails/PostDetails";
import PostList from "./pages/postList/PostList";
import CreatePost from "./pages/createPost/CreatePost";
import Profile from "./pages/profile/Profile";
import Setting from "./pages/setting/Setting";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import "./ThemeColor.css";
import SelectedNavProvider from "./context/SelectedNavContext";
import PostEdit from "./pages/postEdit/PostEdit";
import ProfileEdit from "./pages/profileEdit/ProfileEdit";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <SelectedNavProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={user ? <Navigate to="/postList"/> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/postList" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/:id/edit" element={<PostEdit />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="profile/:id/edit" element={<ProfileEdit />} />
          <Route path="/setting" element={<Setting />} />
          {/* <Route path="/post/:postId" element={<Single />} /> */}
        </Routes>
      </SelectedNavProvider>
    </Router>
  );
}

export default App;
