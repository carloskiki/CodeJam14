import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { ref as dbRef, push, set, get } from 'firebase/database'
import { storage, db } from '../firebase'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Home, BedDouble, Bath, Calendar, Clock } from 'lucide-react';

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

      const imageUploadPromises = images.map((image, index) => 
        uploadImage(image, `${newIndex}/images/${index}.webp`)
      );

      const imageUrls = await Promise.all(imageUploadPromises);

      const thumbnailUrl = thumbnail 
        ? await uploadImage(thumbnail, `${newIndex}/thumbnail/${thumbnail.name}`)
        : imageUrls[0];

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

      const newListingRef = dbRef(db, `Listings/${newIndex}`)
      await set(newListingRef, listing)

      navigate('/')
    } catch (error) {
      console.error('Error uploading listing:', error)
      alert('Error uploading listing. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="p-6">
        <div className="relative mb-6">
        <Link
          to="/"
          className="absolute left-0 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-2 text-black font-bold border border-black rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
          <Home size={20} className="text-black" />
          {<span className="text-[13px]">Back to Listings</span>}
        </Link>
          <h1 className="text-2xl font-bold text-center">List Your Property</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Basic Information</h2>
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Property Title</Label>
              <Input 
                id="title" 
                placeholder="Enter property title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="mt-1"
                required 
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your property"
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="mt-1 h-32"
                required 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-sm font-medium">Monthly Rent ($)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="Enter monthly rent"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="mt-1"
                  required 
                />
              </div>
              <div>
                <Label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</Label>
                <Input 
                  id="bedrooms" 
                  type="number" 
                  placeholder="Number of bedrooms"
                  value={bedrooms} 
                  onChange={(e) => setBedrooms(e.target.value)} 
                  className="mt-1"
                  required 
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</Label>
                <Input 
                  id="bathrooms" 
                  type="number" 
                  placeholder="Number of bathrooms"
                  value={bathrooms} 
                  onChange={(e) => setBathrooms(e.target.value)} 
                  className="mt-1"
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Lease Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leaseStart" className="text-sm font-medium">Lease Start Date</Label>
                <Input 
                  id="leaseStart" 
                  type="date" 
                  value={leaseStart} 
                  onChange={(e) => setLeaseStart(e.target.value)} 
                  className="mt-1"
                  required 
                />
              </div>
              <div>
                <Label htmlFor="contractDuration" className="text-sm font-medium">Contract Duration (months)</Label>
                <Input 
                  id="contractDuration" 
                  type="number" 
                  min="1"
                  placeholder="Duration in months"
                  value={contractDuration} 
                  onChange={(e) => setContractDuration(e.target.value)} 
                  className="mt-1"
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Property Images</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="thumbnail" className="text-sm font-medium">Featured Image</Label>
                <Input 
                  id="thumbnail" 
                  type="file" 
                  onChange={handleThumbnailChange} 
                  accept="image/*" 
                  className="mt-1"
                  required 
                />
                <p className="text-sm text-gray-500 mt-1">This will be the main image shown in listings</p>
              </div>
              <div>
                <Label htmlFor="images" className="text-sm font-medium">Additional Images</Label>
                <Input 
                  id="images" 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  multiple 
                  className="mt-1"
                  required 
                />
                <p className="text-sm text-gray-500 mt-1">You can select up to 10 additional images</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              {isUploading ? 'Uploading...' : 'List Property'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default Uploadpage

