import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
// @ts-ignore
import Button from "./signOutButton";

const Header: React.FC = () => {

    const navigate = useNavigate();

    const handleLogout = () => {
      // TODO: Clear your authentication tokens/state here
      console.log('Logging out user...');
      
      // Redirect back to the login page
      navigate('/login', { replace: true });
    };


    return (

      <header className={styles.headerContainer}>
        <div className={styles.logoGroup}>
          <div className={styles.logoIcon}></div>
          <span className={styles.logoText}>StudentSpend SA</span>
        </div>
        
        <nav className={styles.navGroup}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#about" className={styles.navLink}>About</a>
          <button onClick={() => handleLogout()}>Log out</button>
          <div className={styles.userAvatar}>
            <span className={styles.avatarInitials}>KM</span>
          </div>
        </nav>
      </header>
    );
};

export default Header;