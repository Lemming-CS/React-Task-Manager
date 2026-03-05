import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile.jsx";
import PublicProfile from "./pages/PublicProfile.jsx";
import Project from "./pages/Project.jsx";
import Invites from "./pages/Invites.jsx";
import { useStore } from "./store/useStore.js";
import { Navigate } from "react-router-dom";
import { useThemeEffect } from "./hooks/useThemeEffect.jsx";
import { useAuthListener } from "./hooks/useAuthListener.jsx";
import { useInvitesListener } from "./hooks/useInvitesListener.jsx";

function App() {
  const user = useStore(state => state.user);
  useThemeEffect();
  useAuthListener();
  useInvitesListener();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/profile/:uid" element={user ? <PublicProfile /> : <Navigate to="/login"/>} />
      <Route path="/project/:projectId" element={user ? <Project /> : <Navigate to="/login" />} />
      <Route path="/invites" element={user ? <Invites /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
