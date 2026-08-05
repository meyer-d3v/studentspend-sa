import React from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
// @ts-ignore
import Button from "./signOutButton";

const Header: React.FC = () => {

    const navigate = useNavigate();

    const signOut = () => {
        navigate("/", { replace: true });
    }


    return (

      <header className={styles.headerContainer}>
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>StudentSpend SA</span>
        </div>
        
        <nav className={styles.navGroup}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#about" className={styles.navLink}>About</a>
          <div className={styles.userAvatar}>
            <span className={styles.avatarInitials}>KM</span>
          </div>
        </nav>
      </header>
    );
};

export default Header;