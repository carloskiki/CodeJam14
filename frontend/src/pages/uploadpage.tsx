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
      setImages(Array.from(e.target.files))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const uploadImage = async (file: File, path: string) => {
    const fileRef = storageRef(storage, path)
    await uploadBytes(fileRef, file)
    return getDownloadURL(fileRef)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      const newIndex = latestIndex + 1

      // Upload thumbnail
      const thumbnailUrl = thumbnail ? await uploadImage(thumbnail, `${newIndex}/thumbnail/${thumbnail.name}`) : null

      // Upload images
      const imageUrls = await Promise.all(
        images.map((image, index) => uploadImage(image, `${newIndex}/${index + 1}.webp`))
      )

      // Create listing object
      const listing = {
        title,
        description,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
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
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <Input id="thumbnail" type="file" onChange={handleThumbnailChange} accept="image/*" required />
      </div>
      <div>
        <Label htmlFor="images">Additional Images</Label>
        <Input id="images" type="file" onChange={handleImageChange} accept="image/*" multiple required />
      </div>
      <Button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Submit Listing'}
      </Button>
    </form>
  )
}

export default Uploadpage
