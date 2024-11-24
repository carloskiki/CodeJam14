import React from "react";
import { Search, LogIn, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "../components/ApartmentFinder.module.css";
import { get, ref } from "firebase/database";
import { db } from "@/firebase";
import { RiAccountCircleFill } from "react-icons/ri";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface Apartment {
  id: number;
  title: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
}

interface ApartmentData {
    [id: number]: Apartment
}

const mainpage: React.FC = () => {
   const [apartments, setApartments] = useState<ApartmentData | null>(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   const [hoverCoords, setHoverCoords] = useState({ lat: 45.506184, lng: -73.5786883 });

   const handleLogout = () => {
    // Perform any logout logic here (e.g., clearing user session)
    navigate('/frontpage'); // Navigate to the frontpage
  };
 
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
          <Link to="/" className={styles.logoLink}>
            <img
              src="/images/McGill.png"
              alt="McGill Logo"
              className={styles.logo}
            />
          </Link>
          <h1 className={styles.title}>Apartments</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search apartments..."
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} size={20} />
          </div>
          <Link to="/profile" className={styles.profileLink}>
            <RiAccountCircleFill className={styles.profileIconButton} size={50} />
          </Link>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={20} />
              <span>Logout</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.gridContainer}>
          {/* Apartments Grid */}
          <div className={styles.apartmentGrid}>
            {Object.entries(apartments!).map(([id, apartment]) => (
              <div key={id} className={styles.card}
                onMouseEnter={() => {
                    console.log('Mouse enter:', apartment);
                    setHoverCoords({ lat: apartment.lat, lng: apartment.lng });
                  }
                }
              >
                <Link to={`/detail/${id}`}>
                  <img
                    src={apartment.imageUrl}
                    alt={apartment.title}
                    className={styles.cardImage}
                  />
                </Link>
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

          {/* Map Section */}
          <div className={styles.map}>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={hoverCoords}
              zoom={15}
            >
              <Marker position={hoverCoords} />
            </GoogleMap>
          </div>
        </div>
      </main>
    </div>
  );
};

export default mainpage;
