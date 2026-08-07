import React from "react";
import styles from "../../styles/FallbackUI.module.css";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";


const FallbackUI: React.FC = () => {

    let role = "Superuser";
    const navigate = useNavigate();

    const checkRole = () => {

        if (role === "superuser" || role === "default" || role === "viewer") {
            return true;
        } else {
            return false;
        }
            
    }

    {/*
    const reloadApp = () => {
        window.location.reload();
    };
    */}
    
    const navigateToNextScreen = () => {

        if (checkRole()) {
            //window.location.href = "";
            navigate("/Dashboard"); 
        } else {
            //window.location.href = "/login";
            navigate("/");
        } 
         
    };

    const getYear = () => {
        return new Date().getFullYear().toString();
    };

    return (
        <div className={styles.mainContainer}>
          <div className={styles.formContainer}>
            <div className={styles.info}>
              <div className={styles.iconContainer}>
                <User size={36} color='#FFFFFF' />
              </div>

              <h1 className={styles.title}>Student Spend SA</h1>
              <p className={styles.subtitle}></p>

            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                    Something went wrong
                </div>
                <div className={styles.cardDescription}>
                  
                </div>
                <div className={styles.cardContent}>

                    <p style={{ marginBottom: "2rem", color: "#555", fontSize: "15px", lineHeight: "30px"}}>
                        The application ran into an unexpected problem.<br/>
                        Your data is safe — this is a system error.
                    </p>

                    


                    <button type='button' className={styles.returnButton} onClick={navigateToNextScreen}>
                        Return to {checkRole() ? "dashboard" : "login"}
                    </button> 
                  
                </div>
              </div>
            </div>

            {/*
            <p className={styles.rights} onClick={() => nextPage("Register")}>
              Click to register
            </p>
            */}
            <p className={styles.rights}>
              © {getYear()} Admin Portal. All rights reserved.
            </p>
          </div>
       </div>
    )

};

export default FallbackUI;