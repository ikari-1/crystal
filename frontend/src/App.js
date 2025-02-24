import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route path="/profile/:username" element={<Profile />} /> */}
        {/* <Route path="/write" element={<Write />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/post/:postId" element={<Single />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
