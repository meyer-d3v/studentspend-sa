import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
// @ts-ignore
import Button from "./signOutButton";

const Header: React.FC = () => {

    const navigate = useNavigate();

    const pageNavigation = (path: string) => {

      navigate("/" + path);

    }


    return (

      <header className={styles.headerContainer}>
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>StudentSpend SA</span>
        </div>
        
        <nav className={styles.navGroup}>
          <div className={styles.navLink} onClick={() => pageNavigation("")}>Home</div>
          <div className={styles.navLink} onClick={() => pageNavigation("about")}>About</div>
          <div className={styles.userAvatar} onClick={() => pageNavigation("settings")}>
            <span className={styles.avatarInitials}>DM</span>
          </div>
        </nav>
      </header>
    );
};

export default Header;