import React from "react";
import styles from "../components/ApartmentFinder.module.css";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  poster: {
    name: string;
    profilePicture: string;
    email: string;
  };
}

const listing = {
  id: 1,
  title: "Cozy Studio Near Campus",
  description:
    "A comfortable studio apartment located just minutes away from McGill University. Perfect for students or young professionals.",
  price: "$800/month",
  bedrooms: 0,
  bathrooms: 1,
  images: [
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ],
  poster: {
    name: "John Doe",
    profilePicture: "/placeholder-profile.jpg",
    email: "johndoe@example.com",
  },
};

const DetailPage: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Top Section */}
      <div className={styles.topSection}>
        <div className={styles.imageGallery}>
          {listing.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Listing Image ${index + 1}`}
              className={styles.cardImage} // Reusing styles
            />
          ))}
        </div>
        <div className={styles.mainInfo}>
          <h1 className={styles.title}>{listing.title}</h1>
          <p className={styles.cardPrice}>{listing.price}</p>
          <p className={styles.description}>{listing.description}</p>
        </div>
      </div>

      {/* More Details */}
      <div className={styles.detailsSection}>
        <h2 className={styles.sectionTitle}>More Details</h2>
        <div className={styles.detailsGrid}>
          <p>
            <strong>Bedrooms:</strong> {listing.bedrooms}
          </p>
          <p>
            <strong>Bathrooms:</strong> {listing.bathrooms}
          </p>
        </div>
      </div>

      {/* Poster Info */}
      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>Posted By</h2>
        <div className={styles.profile}>
          <img
            src={listing.poster.profilePicture}
            alt="Poster Profile"
            className={styles.profilePicture}
          />
          <div className={styles.profileDetails}>
            <p className={styles.posterName}>{listing.poster.name}</p>
            <a
              href={`mailto:${listing.poster.email}`}
              className={styles.contactButton}
            >
              Contact Poster
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
