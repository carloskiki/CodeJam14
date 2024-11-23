import React from "react";
import { Search, LogIn } from "lucide-react";
import styles from "../components/ApartmentFinder.module.css";

interface Apartment {
  id: number;
  title: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
}

//Hardcoded apartments (will need to obtain data from database later)
const apartments: Apartment[] = [
  {
    id: 1,
    title: "Cozy Studio Near Campus",
    price: "$800/month",
    bedrooms: 0,
    bathrooms: 1,
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Spacious 2BR Apartment",
    price: "$1200/month",
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Modern 1BR with Balcony",
    price: "$950/month",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "3BR Family Home",
    price: "$1500/month",
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "Luxury Penthouse Suite",
    price: "$2000/month",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Affordable Student Housing",
    price: "$600/month",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
];

const mainpage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <img
            src="/images/McGill.png"
            alt="McGill Logo"
            className={styles.logo}
          />
          <h1 className={styles.title}>Apartments</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search apartments..."
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} size={20} />
          </div>
          <button className={styles.loginButton}>
            <LogIn size={20} />
            <span>Login</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {apartments.map((apartment) => (
            <div key={apartment.id} className={styles.card}>
              <img
                src={apartment.imageUrl}
                alt={apartment.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{apartment.title}</h2>
                <p className={styles.cardPrice}>{apartment.price}</p>
                <div className={styles.cardDetails}>
                  <span>
                    {apartment.bedrooms}{" "}
                    {apartment.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                  </span>
                  <span>
                    {apartment.bathrooms}{" "}
                    {apartment.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default mainpage;
