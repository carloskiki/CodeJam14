import React, { useState, useEffect, useCallback } from "react";
import { Search, LogOut } from 'lucide-react';
import styles from "../components/ApartmentFinder.module.css";
import { get, query, ref, orderByKey, limitToFirst, startAfter, endBefore, limitToLast } from "firebase/database";
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
  latitude: number;
  longitude: number;
}

const MainPage: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [lastKey, setLastKey] = useState<string | null>(null);
  const [firstKey, setFirstKey] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [hoverPosition, setHoverPosition] = useState({ lat: 45.504, lng: -73.577 });
  const [zoom, setZoom] = useState(18);

  const POSTS_PER_PAGE = 6;

  const handleLogout = () => {
    navigate("/frontpage");
  };

  // Fetch apartments with pagination
  const fetchApartments = async (action: "next" | "prev" | "initial") => {
    setLoading(true);

    try {
      const apartmentsRef = ref(db, "Listings/");
      let apartmentsQuery;

      if (action === "next" && lastKey) {
        apartmentsQuery = query(
          apartmentsRef,
          orderByKey(),
          startAfter(lastKey),
          limitToFirst(POSTS_PER_PAGE)
        );
      } else if (action === "prev" && firstKey) {
        apartmentsQuery = query(
          apartmentsRef,
          orderByKey(),
          endBefore(firstKey),
          limitToLast(POSTS_PER_PAGE)
        );
      } else {
        apartmentsQuery = query(
          apartmentsRef,
          orderByKey(),
          limitToFirst(POSTS_PER_PAGE)
        );
      }

      const snapshot = await get(apartmentsQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const fetchedApartments = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Apartment),
        }));

        setApartments(fetchedApartments);

        if (fetchedApartments.length > 0) {
          const newFirstKey = fetchedApartments[0].id;
          const newLastKey = fetchedApartments[fetchedApartments.length - 1].id;

          setFirstKey(newFirstKey);
          setLastKey(newLastKey);

          setHasNextPage(fetchedApartments.length === POSTS_PER_PAGE);
          setHasPrevPage(action === "prev" || firstKey !== null);
        }
      } else {
        setApartments([]);
        setHasNextPage(false);
        setHasPrevPage(false);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search apartments in the database
  const searchApartments = async (term: string) => {
    setLoading(true);

    try {
      const apartmentsRef = ref(db, "Listings/");
      const snapshot = await get(apartmentsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const fetchedApartments = Object.entries(data)
          .map(([id, value]) => ({
            id,
            ...(value as Apartment),
          }))
          .filter(
            (apartment) =>
              apartment.title.toLowerCase().includes(term.toLowerCase()) ||
              apartment.address.toLowerCase().includes(term.toLowerCase())
          );

        setApartments(fetchedApartments);
        setHasNextPage(false); // Disable pagination for search results
        setHasPrevPage(false);
      } else {
        setApartments([]);
      }
    } catch (error) {
      console.error("Error searching apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (searchTerm.trim() === "") {
        fetchApartments("initial");
      } else {
        searchApartments(searchTerm);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    fetchApartments("initial");
    setHasPrevPage(false);
  }, []);

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
          <h1 className={styles.title}>Apartments</h1>
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
              <div
                key={apartment.id}
                className={styles.card}
                onMouseEnter={() => {
                  setHoverPosition({ lat: apartment.latitude, lng: apartment.longitude });
                  setZoom(18);
                }}
              >
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
              center={hoverPosition}
              zoom={zoom}
            >
              {apartments.map((apartment) => (
                <Marker
                  key={apartment.id}
                  position={{ lat: apartment.latitude, lng: apartment.longitude }}
                  title={apartment.title}
                />
              ))}
            </GoogleMap>
          </div>

          {/* Pagination Controls */}
          {!searchTerm.trim() && (
            <div className={styles.pagination}>
              <button
                className={styles.pagePrevButton}
                onClick={() => fetchApartments("prev")}
                disabled={!hasPrevPage}
              >
                Previous
              </button>
              <button
                className={styles.pageNextButton}
                onClick={() => fetchApartments("next")}
                disabled={!hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;