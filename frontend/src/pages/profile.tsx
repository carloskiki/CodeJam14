import React, { useState } from 'react'
import { Search, LogIn } from 'lucide-react'
import styles from '../components/ApartmentFinder.module.css'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual update logic here
    console.log('Profile updated:', { username, phoneNumber })
    navigate('/')
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">New Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter new username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">New Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter new phone number"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="submit" onClick={handleUpdate}>Update</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProfilePage;
