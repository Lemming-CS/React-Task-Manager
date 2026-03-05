import { useStore } from "../store/useStore";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import sun from "../assets/sun.png";
import moon from "../assets/moon.png";
import styles from "./static/Header.module.css";
import defaultUser from "../assets/defaultUser.png";

function Header({ showHome, showProfile, showBell }) {
  const theme = useStore(state => state.theme);
  const toggleTheme = useStore(state => state.toggleTheme);
  const user = useStore(state => state.user);
  const invites = useStore(s => s.invites);

  const navigate = useNavigate();

  const logOut = () => {
    signOut(auth);
  };

return (
  <div className={styles.header}>
    <div className={styles.left}>
      {showHome && (
        <button onClick={() => navigate("/")}>Home</button>
      )}

      {showProfile && user && (
        <button onClick={() => navigate("/profile")} className={styles.profileButton}>
          <img src={user.profilePicture || defaultUser} />
          {user.username}
        </button>
      )}
    </div>

    <div className={styles.headerRight}>
      <button onClick={toggleTheme} id="themeButton">
        {theme === "light"
          ? <img src={sun} />
          : <img src={moon} />}
      </button>
      {showBell && user &&       
      <button className={styles.bell} onClick={() => navigate("/invites")}>
        🔔
        {invites.length > 0 && <span className={styles.badge}>{invites.length}</span>}
      </button>}

      {user && <button onClick={logOut}>Log Out</button>}
    </div>
  </div>
);
}

export default Header;