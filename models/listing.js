// models/listing.js

import { Schema, model, models } from "mongoose";

const listingSchema = new Schema({
  ownerEmail: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  image: {
    filename: { type: String, default: 'defaultimage' },
    url: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  },
  price: Number,
  location: String,
  country: String,
  
});

const Listing = models.Listing || model("Listing", listingSchema);

export default Listing;