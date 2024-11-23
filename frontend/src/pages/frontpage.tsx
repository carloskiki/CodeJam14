import React, { useState } from 'react';
import { Search, LogIn } from 'lucide-react'
import styles from '../components/ApartmentFinder.module.css'
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import Login from '../pages/login';
import Signup from '../pages/signup';

function frontpage() {

  return (
    <div className = "frontpage">
      <button>Log In</button>
      <button>Sign Up</button>
    </div>
  );
}


export default frontpage;
