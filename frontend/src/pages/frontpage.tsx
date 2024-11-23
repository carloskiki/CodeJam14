import React, { useState, useEffect } from 'react';
import { Search, LogIn } from 'lucide-react'
import styles from '../components/ApartmentFinder.module.css'
import { get, ref } from 'firebase/database';
import { db } from '../firebase';

interface Apartment {
  id: number
  title: string
  price: string
  bedrooms: number
  bathrooms: number
  imageUrl: string
}

const mainpage: React.FC = () => {
  const [apartments, setApartments] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firebase on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, 'Listings/')); // Adjust path as necessary
        if (snapshot.exists()) {
          setApartments(snapshot.val());  // Set the data into state
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);  // Set loading to false after fetching
      }
    };

    fetchData();  // Call fetch function on component load
  }, []); // Empty array means it only runs on mount (componentDidMount)

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>McGill Apartment Finder</h1>
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
              <img src={apartment.imageUrl} alt={apartment.title} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{apartment.title}</h2>
                <p className={styles.cardPrice}>{apartment.price}</p>
                <div className={styles.cardDetails}>
                  <span>{apartment.bedrooms} {apartment.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                  <span>{apartment.bathrooms} {apartment.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default mainpage
