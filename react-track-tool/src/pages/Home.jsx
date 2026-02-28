import styles from "./static/Home.module.css"
import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import defaultUserIMG from "../assets/defaultUser.png"

function Home() {
  const user = useStore(state => state.user);
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  const navProfile = () => {
    navigate('/profile');
  }

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
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.profileButton} onClick={navProfile}>
          <img src={defaultUserIMG} />
          {user.username}
        </button>
        <button onClick={logOut}>Log Out</button>
      </div>
      <h1>Home</h1>
      {user && <p>Welcome, {user.username}</p>}
    </div>
  );
}

export default Home;