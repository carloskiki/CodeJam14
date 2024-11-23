import React, { useState } from 'react';
import { Search, LogIn } from 'lucide-react'
import styles from '../components/ApartmentFinder.module.css'
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import Login from '../pages/login';
import Signup from '../pages/signup';
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button'

interface FrontpageProps {
  navigateTo: (view: "login" | "signup") => void;
}

const Frontpage: React.FC<FrontpageProps> = ({ navigateTo }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to McGill Apartment Finder</h1>
      <div className="space-x-4">
        <Button onClick={() => navigateTo("login")}>
          Login
        </Button>
        <Button variant="outline" onClick={() => navigateTo("signup")}>
          Sign Up
        </Button>
      </div>
    </main>
  );
};

export default Frontpage;