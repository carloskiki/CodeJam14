import React from 'react';
import { Search, LogIn } from 'lucide-react'
import styles from '../components/ApartmentFinder.module.css'
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import Login from '../pages/login';
import Signup from '../pages/signup';

const frontpage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to McGill Apartment Finder</h1>

      <Login />
      <Signup />
    </div>
  );
};

export default frontpage;
