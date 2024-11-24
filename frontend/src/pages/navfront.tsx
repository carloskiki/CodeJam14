import React from "react";
import styles from "../components/ApartmentFinder.module.css";
import { Link } from "react-router-dom";

const navfront: React.FC = () => {
 
   return (
       <header className={styles.header}>
         <div className={styles.headerContent}>
           <Link to="/" className={styles.logoLink}>
             <img
               src="/images/McGill.png"
               alt="McGill Logo"
               className={styles.logo}
             />
           </Link>
           <h1 className={styles.appName}>Martlet's Nest</h1>
         </div>
       </header>
   );
 };
 
 export default navfront;