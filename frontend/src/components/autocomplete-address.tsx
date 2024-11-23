import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Autocomplete } from '@react-google-maps/api';


// ProtectedRoute component that checks if the user is logged in
const AddressForm: React.FC = () => {
    const [address, setAddress] = useState('')
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        // Load the Google Maps script dynamically if you haven't already loaded it
        if (!window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);
    
    const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address!); // This is the full address from Google Maps
      // You can also handle place details here, like extracting the latitude/longitude
    }
  };

    return (
        <Autocomplete
            onLoad={(autocompleteInstance) => setAutocomplete(autocompleteInstance)}
            onPlaceChanged={handlePlaceChanged}
        >
            <Input
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-grow"
            />
        </Autocomplete>
    )
};

export default AddressForm;
