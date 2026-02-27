import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
function Home() {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="body">
      <div className="header">
        <button onClick={logOut}>Log Out</button>
      </div>
      <h1>Home</h1>
      {user && <p>Welcome, {user.username}</p>}
    </div>
  );
}

export default Home;