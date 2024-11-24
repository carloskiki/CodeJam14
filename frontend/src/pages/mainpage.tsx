import React, { useState, useEffect, useCallback } from "react";
import { Search, LogOut } from 'lucide-react';
import styles from "../components/ApartmentFinder.module.css";
import { get, query, ref, orderByKey, limitToFirst } from "firebase/database";
import { db } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface Apartment {
  id: string;
  title: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  address: string;
  lat: number;
  lng: number;
}

const MainPage: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 6; // Number of items per page

  const handleLogout = () => {
    navigate("/frontpage");
  };

  const fetchApartments = useCallback(async (search: string = "") => {
    setLoading(true);
    try {
      const apartmentsRef = ref(db, "Listings/");
      const apartmentsQuery = query(
        apartmentsRef,
        orderByKey(),
        limitToFirst(100) // Fetch more apartments for client-side filtering
      );

      const snapshot = await get(apartmentsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        let fetchedApartments = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Apartment),
        }));

        if (search) {
          const searchWords = search.toLowerCase().split(' ');
          fetchedApartments = fetchedApartments.filter(apartment => 
            searchWords.some(word => apartment.title.toLowerCase().includes(word))
          );
        }

        setApartments(fetchedApartments.slice(0, POSTS_PER_PAGE));
      } else {
        setApartments([]);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  }, []);

  const handleSearchSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchApartments(searchTerm);
  }, [searchTerm, fetchApartments]);

  useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

  if (loading && apartments.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logoLink}>
            <img src="/images/McGill.png" alt="McGill Logo" className={styles.logo} />
          </Link>
          <h1 className={styles.title}>partments</h1>
          <form onSubmit={handleSearchSubmit} className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search apartments..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className={styles.searchButton}>
              <Search className={styles.searchIcon} size={20} />
            </button>
          </form>

          <Link to="/upload" className={styles.profileLink}>
            <button className={styles.uploadButton}>
              <span>Post Listing</span>
            </button>
          </Link>

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
          <div className={styles.apartmentGrid}> 
            {apartments.map((apartment) => (
              <div key={apartment.id} className={styles.card}>
                <Link to={`/detail/${apartment.id}`}>
                  <img
                    src={apartment.imageUrl}
                    alt={apartment.title}
                    className={styles.cardImage}
                  />
                </Link>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>{apartment.title}</h2>
                  <p className={styles.cardAddress}>{apartment.address}</p>
                  <p className={styles.cardPrice}>CAD {apartment.price} per month</p>
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

          <div className={styles.map}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={{ lat: 45.504, lng: -73.577 }}
              zoom={15}
            >
              {apartments.map((apartment) => (
                <Marker 
                  key={apartment.id} 
                  position={{ lat: apartment.lat, lng: apartment.lng }} 
                  title={apartment.title}
                />
              ))}
            </GoogleMap>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;

