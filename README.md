# CodeJam 14 Project

## Questions
- What is the auth workflow?
    - Send a link (with session or JWT) to the user's email.
    - Password login (annoying for users, and annoying to store in DB)
    - OAuth (Seems hard to implement, maybe doable with mycourses).

- What's the MVP?:
    - Can see listings
    - Can create listings
    - Can set up meetings for listings


## Listing
- Address
- Images
- Description
- Price (?)
- Location on map (Extra)
- Tags (Exchange, Rent, Sell, Looking for Roomates, etc.)

- Meeting info


## User
- Email
- Name (do we get it from the McGill email?)
- Listings

### Database

GET:
 - listings with filters

 POST:
 - Listings
 - Sign Up
 - Log In


#### Things
- Listings
- Users
