import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  poster: {
    name: string; //name of user
    profilePhoto: string; //pfp for user
  };
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading apartment details...</p>
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
          <p className="text-2xl font-semibold text-gray-500 mt-1">
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

        <div className="flex items-center">
          <div className="flex items-center gap-16">
            <img
              src={apartment.poster?.profilePhoto ?? ""}
              alt={`${apartment.poster?.name ?? ""}'s profile`}
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
          </div>
          <p className="text-lg font-semibold">
            {apartment.poster?.name ?? ""}
          </p>
          <p className="text-sm font-semibold">
            {apartment.poster?.name ?? ""}
          </p>
        </div>

        {/* Schedule Button */}
        <div className="text-center">
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
