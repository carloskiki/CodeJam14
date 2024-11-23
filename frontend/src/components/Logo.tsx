import React from "react";
import styles from "./ApartmentFinder.module.css";

const Logo: React.FC = () => {
  return (
    <img src="/images/McGill.png" alt="McGill Logo" className={styles.logo} />
  );
};

export default Logo;
