// src/components/ListingForm.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToyswapApi from "../api/api";

function ListingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    available: true,
    state: "",
    city: "",
  });

  function handleChange(evt) {
    const { name, value } = evt.target;
    // Handle the `available` checkbox
    if (name === "available") {
      setFormData((data) => ({
        ...data,
        [name]: evt.target.checked,
      }));
    } else {
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      console.log(formData);
      await ToyswapApi.createListing(formData);
      navigate("/my_listings");
    } catch (err) {
      console.error("Error creating listing:", err);
    }
  }

  return (
    <div className="ListingForm col-md-6 offset-md-3">
      <h3>Create a Listing</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input
            name="image_url"
            className="form-control"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="available">Available</label>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            name="state"
            className="form-control"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            name="city"
            className="form-control"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ListingForm;
