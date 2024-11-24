import React, { useState, useEffect } from "react";
import { Search, LogOut } from "lucide-react";
import styles from "../components/ApartmentFinder.module.css";
import { get, query, ref, orderByKey, limitToFirst, limitToLast, startAfter, endBefore } from "firebase/database";
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
}

const MainPage: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastKey, setLastKey] = useState<string | null>(null); // Last key for next page
  const [firstKey, setFirstKey] = useState<string | null>(null); // First key for previous page
  const [hasNextPage, setHasNextPage] = useState(true); // Are there more pages ahead?
  const [hasPrevPage, setHasPrevPage] = useState(false); // Are there previous pages?
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 6; // Number of items per page

  const handleLogout = () => {
    navigate("/frontpage"); // Navigate to the frontpage
  };

  // **Fetch Apartments**
  const fetchApartments = async (action: "next" | "prev") => {
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
        // First page
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
          const newFirstKey = fetchedApartments[0].id; // First item of the new page
          const newLastKey = fetchedApartments[fetchedApartments.length - 1].id; // Last item of the new page
  
          setFirstKey(newFirstKey);
          setLastKey(newLastKey);
  
          // Set `hasNextPage` if we have enough items to fill the page
          setHasNextPage(fetchedApartments.length === POSTS_PER_PAGE);
  
          // Determine `hasPrevPage`
          if (action === "prev" && newFirstKey === fetchedApartments[0].id && !firstKey) {
            // Back to the first page
            setHasPrevPage(newFirstKey !== fetchedApartments[0].id);
          } else {
            setHasPrevPage(action === "prev" || (action === "next" && firstKey !== null));
          }
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

  // Load the initial page
  useEffect(() => {
    fetchApartments("next");
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
          <h1 className={styles.title}>partments</h1>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search apartments..."
              className={styles.searchInput}
            />
            <Search className={styles.searchIcon} size={20} />
          </div>

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
              mapContainerStyle={{ width: "100%", height: "400px" }}
              /* TODO: Make this be the places in the mainpage */
              center={{ lat: 45.504, lng: -73.577 }}
              zoom={15}
            >
              {/* TODO: Make this be the places in the mainpage */}
              <Marker position={{ lat: 45.504, lng: -73.577 }} />
            </GoogleMap>
          </div>

          {/* Pagination Controls */}
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

        </div>
      </main>
      </div>
  );
};

export default MainPage;