import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../components/ApartmentFinder.module.css";
import { ref, get } from "firebase/database";
import { db } from "../firebase";

interface ApartmentDetails {
  id: number;
  title: string;
  description: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  imageUrls: string[];
  leaseStart: string;
  contractDuration: number;
}

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<ApartmentDetails | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        const apartmentRef = ref(db, `Listings/${id}`);
        const snapshot = await get(apartmentRef);
        if (snapshot.exists()) {
          setApartment(snapshot.val());
        } else {
          console.error("No data available");
        }
      } catch (error) {
        console.error("Error fetching apartment details:", error);
      }
    };

    fetchApartmentDetails();
  }, [id]);

  if (!apartment) {
    return <div>Loading apartment details...</div>;
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % apartment.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + apartment.imageUrls.length) % apartment.imageUrls.length);
  };

  return (
    <div className={styles.detailContainer}>
      <h1>{apartment.title}</h1>
      <div className={styles.imageCarousel}>
        <button onClick={prevImage}>Previous</button>
        <img src={apartment.imageUrls[currentImageIndex]} alt={apartment.title} />
        <button onClick={nextImage}>Next</button>
      </div>
      <div className={styles.infoBox}>
        <p>Price: {apartment.price}</p>
        <p>Bedrooms: {apartment.bedrooms}</p>
        <p>Bathrooms: {apartment.bathrooms}</p>
        <p>Lease Start: {new Date(apartment.leaseStart).toLocaleDateString()}</p>
        <p>Contract Duration: {apartment.contractDuration} months</p>
      </div>
      <Link to="/frontpage">Go Back to Frontpage</Link>
    </div>
  );
};

export default DetailPage;
