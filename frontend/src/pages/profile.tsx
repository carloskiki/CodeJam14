import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { ref, set, get } from 'firebase/database';
import { db } from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserProfile {
  name: string;
  phoneNumber: string;
  profilePhoto: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const { email } = useUser();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const storage = getStorage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!email) return;

      try {
        // Replace dots in email with underscores for Firebase path
        const userRef = ref(db, `Poster/${email.replace(/\./g, '_')}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val() as UserProfile;
          setName(userData.name || '');
          setPhoneNumber(userData.phoneNumber || '');
          setProfilePhotoUrl(userData.profilePhoto || '');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [email]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      let photoUrl = profilePhotoUrl;

      if (profilePhoto) {
        // Upload new profile photo if selected
        const imageRef = storageRef(storage, `profile-photos/${email}/${profilePhoto.name}`);
        await uploadBytes(imageRef, profilePhoto);
        photoUrl = await getDownloadURL(imageRef);
      }

      const userData: UserProfile = {
        name,
        phoneNumber,
        profilePhoto: photoUrl,
        email
      };

      // Save to Firebase Realtime Database
      const userRef = ref(db, `Poster/${email.replace(/\./g, '_')}`);
      await set(userRef, userData);

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return <div className="container mx-auto px-4 py-8">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              disabled
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <Input
              type="file"
              id="profilePhoto"
              onChange={handleFileChange}
              className="mt-1"
              accept="image/*"
            />
            {profilePhotoUrl && (
              <div className="mt-2">
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
