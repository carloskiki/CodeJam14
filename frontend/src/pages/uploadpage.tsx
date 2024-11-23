import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref as dbRef, push, set, get } from 'firebase/database'
import { storage, db } from '../firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const Uploadpage: React.FC = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [leaseStart, setLeaseStart] = useState('')
  const [contractDuration, setContractDuration] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [latestIndex, setLatestIndex] = useState<number>(0)

  useEffect(() => {
    const fetchLatestIndex = async () => {
      const listingsRef = dbRef(db, 'Listings')
      const snapshot = await get(listingsRef)
      if (snapshot.exists()) {
        const listings = snapshot.val()
        const indices = Object.keys(listings).map(Number)
        setLatestIndex(Math.max(...indices))
      }
    }
    fetchLatestIndex()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      // Limit to first 10 images if more are selected
      setImages(fileArray.slice(0, 10));
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const uploadImage = async (file: File, path: string) => {
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const newIndex = latestIndex + 1;

      // Upload all images first (including thumbnail)
      const imageUploadPromises = images.map((image, index) => 
        uploadImage(image, `${newIndex}/images/${index}.webp`)
      );

      // Wait for all images to upload and get their URLs
      const imageUrls = await Promise.all(imageUploadPromises);

      // Set the first image as thumbnail if no specific thumbnail was chosen
      const thumbnailUrl = thumbnail 
        ? await uploadImage(thumbnail, `${newIndex}/thumbnail/${thumbnail.name}`)
        : imageUrls[0];

      // Create listing object
      const listing = {
        title,
        description,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        leaseStart,
        contractDuration: parseInt(contractDuration),
        imageUrl: thumbnailUrl,
        imageUrls,
        createdAt: Date.now(),
      }

      // Save to Firebase Realtime Database
      const newListingRef = dbRef(db, `Listings/${newIndex}`)
      await set(newListingRef, listing)

      // Redirect to home page or listing page
      navigate('/')
    } catch (error) {
      console.error('Error uploading listing:', error)
      alert('Error uploading listing. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <Input id="bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="bathrooms">Bathrooms</Label>
        <Input id="bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="leaseStart">Lease Start Date</Label>
        <Input 
          id="leaseStart" 
          type="date" 
          value={leaseStart} 
          onChange={(e) => setLeaseStart(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="contractDuration">Contract Duration (months)</Label>
        <Input 
          id="contractDuration" 
          type="number" 
          min="1"
          value={contractDuration} 
          onChange={(e) => setContractDuration(e.target.value)} 
          required 
        />
      </div>
      <div>
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <Input id="thumbnail" type="file" onChange={handleThumbnailChange} accept="image/*" required />
      </div>
      <div>
        <Label htmlFor="images">Images</Label>
        <Input id="images" type="file" onChange={handleImageChange} accept="image/*" multiple required />
      </div>
      <Button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Submit Listing'}
      </Button>
    </form>
  )
}

export default Uploadpage
