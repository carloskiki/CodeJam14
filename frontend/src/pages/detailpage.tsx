import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../components/ApartmentFinder.module.css";
import { ref, get } from "firebase/database";
import { db } from "../firebase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BedDouble,
  Bath,
  Calendar,
  Clock,
} from "lucide-react";
import { PopupButton } from "react-calendly";
import { DirectionsRenderer, DirectionsService, GoogleMap, InfoWindow } from "@react-google-maps/api";

interface PosterProfile {
  name: string;
  phoneNumber: string;
  profilePhoto: string;
  email: string;
}

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
  address: string;
  contractDuration: number;
  poster: {
    email: string;
  };
  location: string;
  latitude: number;
  longitude: number;
}

const endLocation = { lat: 45.504, lng: -73.577 };

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<ApartmentDetails | null>(null);
  const [posterProfile, setPosterProfile] = useState<PosterProfile | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [eta, setEta] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch apartment details
        const apartmentRef = ref(db, `Listings/${id}`);
        const apartmentSnapshot = await get(apartmentRef);
        
        if (apartmentSnapshot.exists()) {
          const apartmentData = apartmentSnapshot.val() as ApartmentDetails;
          setApartment(apartmentData);

          // Fetch poster profile using the email from apartment data
          if (apartmentData.poster?.email) {
            const posterRef = ref(db, `Poster/${apartmentData.poster.email.replace(/\./g, '_')}`);
            const posterSnapshot = await get(posterRef);
            
            if (posterSnapshot.exists()) {
              setPosterProfile(posterSnapshot.val() as PosterProfile);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [id]);

  
  // Handle the DirectionsService response
  const handleDirectionsResponse = (result, status) => {
    if (status === "OK") {
        if (directions === null) {
            setDirections(result);
          // Extract the travel duration from the directions result
          const travelDuration = result.routes[0].legs[0].duration.text; // Duration in human-readable format
          setEta(travelDuration); // Set the ETA in human-readable format
            
        }
    } else {
      console.error("Error fetching directions:", status);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!apartment) {
    return (
      <div>
        <p>Apartment not found</p>
        <Link to="/">Back to listings</Link>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % apartment.imageUrls.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + apartment.imageUrls.length) %
        apartment.imageUrls.length
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="p-6">
        {/* Navigation */}
        <div className="bg-red-600 w-full rounded-md">
          <div className="container mx-auto px-4 py-2">
            <Link
              to="/"
              className="text-white font-bold hover:text-gray-200 flex items-center gap-2"
            >
              <Home size={20} className="text-white" />{" "}
              {/* Ensure the icon is white */}
              <span className="text-white">Back to Listings</span>
            </Link>
          </div>
        </div>

        {/* Title and Price */}
        <div className="mb-4 mt-3 text-left pl-2">
          <h1 className="text-5xl font-bold">{apartment.title}</h1>
          <div className="relative">
            <img
              src={posterProfile?.profilePhoto || "/default-profile.png"}
              alt={`${posterProfile?.name || "Anonymous"}'s profile`}
              className="absolute top-0 right-4 w-16 h-16 rounded-full border-2 border-gray-300"
            />
          </div>
          <p className="text-2xl font-semibold text-gray-500 ">
            {apartment.address}
          </p>{" "}
          {/*need to link this to .location field!!!!!!}*/}
          {/* Address Line */}
          <p className="text-2xl font-semibold text-gray-500">
            ${apartment.price}/month
          </p>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-8 rounded-lg overflow-hidden bg-gray-100 aspect-video">
          <img
            src={apartment.imageUrls[currentImageIndex]}
            alt={`${apartment.title} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
          >
            <ChevronRight size={24} />
          </button>
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {apartment.imageUrls.length}
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Key Features */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Property Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <BedDouble className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Bedrooms</p>
                  <p className="font-semibold">{apartment.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Bathrooms</p>
                  <p className="font-semibold">{apartment.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Lease Start</p>
                  <p className="font-semibold">
                    {new Date(apartment.leaseStart).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">Contract Duration</p>
                  <p className="font-semibold">
                    {apartment.contractDuration} months
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {apartment.description}
            </p>
          </Card>
        </div>
        

        <div className="flex justify-between">
        {/* Poster Information */}
        <Card className="p-6 mt-6 min-w-96 max-w-xl mx-auto h-64">
          <h2 className="text-xl font-semibold mb-4 text-center">Contact Information</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={posterProfile?.profilePhoto || "/default-profile.png"}
                alt={`${posterProfile?.name || "Anonymous"}'s profile`}
                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
              />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-lg font-semibold">
                {posterProfile?.name || "Anonymous"}
              </p>
              <p className="text-sm text-gray-600">
                {posterProfile?.email || apartment.poster?.email || "No email provided"}
              </p>
              {posterProfile?.phoneNumber && (
                <p className="text-sm text-gray-600">
                  {posterProfile.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </Card>
          <div className={styles.map}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={endLocation}
              zoom={14}
            >
              {/* Show the route using DirectionsRenderer */}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                />
              )}
              

              {/* DirectionsService to calculate the route */}
              <DirectionsService
                options={{
                  origin: {
                    lat: apartment.latitude,
                    lng: apartment.longitude,
                  },
                  destination: endLocation,
                  travelMode: "WALKING", // You can change to WALKING, BICYCLING, etc.
                }}
                callback={handleDirectionsResponse}
              />

          {/* Optional: Show the ETA with an InfoWindow on the map */}
        {eta && (
              <InfoWindow position={endLocation}>
                <div>
                  <strong>Walking:</strong> {eta}
                </div>
              </InfoWindow>
            )}
            </GoogleMap>
          </div>
        
        </div>

        {/* Schedule Button */}
        <div className="text-center mt-6">
          <PopupButton
            url="https://calendly.com/moodcatcher103/apartment-visit"
            rootElement={document.getElementById("root")!}
            text="Schedule a visit"
            styles={{
              color: "#ffffff",
              backgroundColor: "#2563eb",
              padding: "0.5rem 2rem",
              fontSize: "1.125rem",
              lineHeight: "1.75rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default DetailPage;
