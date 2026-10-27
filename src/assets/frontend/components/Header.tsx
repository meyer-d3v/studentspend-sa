import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../styles/Header.module.css";
// @ts-ignore
import Button from "./signOutButton";
// @ts-ignore
import { db } from "../../backend/firebaseConfig/config";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Header: React.FC = () => {

    const navigate = useNavigate();

    const pageNavigation = (path: string) => {

      navigate("/" + path);

    }
    const [userData, setUserData] = useState({
      firstname: "",
      lastname: "",
    }); 

    const getUserData = async () => {

      try {

        const uid = getAuth().currentUser?.uid;
  
        if (!uid) {
  
          console.log("User not logged in");
          navigate("/");
          return;
  
        }
  
        const ref = doc(db, "users", uid);
        const snapshot = await getDoc(ref);
  
        const data = snapshot.data() as { firstName: string, lastName: string };
  
        setUserData({
          firstname: data.firstName,
          lastname: data.lastName,
        })
  
      } catch (e) {
  
        console.log("Error occured: " + e);
  
      }
  
    }

    useEffect(() => {

      getUserData();
  
    }, []);


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
            <span className={styles.avatarInitials}>{(userData?.firstname?.charAt(0) || "") + (userData?.lastname?.charAt(0) || "")}</span>
          </div>
        </nav>
      </header>
    );
};

export default Header;