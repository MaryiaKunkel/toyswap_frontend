// src/reviews/ReviewForm.js

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToyswapApi from "../api/api";
import UserContext from "../auth/UserContext";

function ReviewForm() {
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    reviewed_username: "",
    title: "",
    review_text: "",
    review_date: formatDate(new Date()),
  });

  const [users, setUsers] = useState([]);
  const [sellerUsernames, setSellerUsernames] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const users = await ToyswapApi.getUsersList();
      setUsers(users.users);
    }
    fetchUsers();
  }, []);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((fData) => ({
      ...fData,
      [name]: value,
    }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      await ToyswapApi.createReview(formData);
      navigate("/listings");
    } catch (err) {
      console.error("Error creating review:", err);
    }
  }

  useEffect(() => {
    async function getToyExchange() {
      try {
        const exchanges = await ToyswapApi.getToyExchange(currentUser.username);
        console.log("exchanges:", exchanges);
        const usernames = new Set(
          exchanges.map((exchange) => exchange.shared_by_username)
        );
        setSellerUsernames(Array.from(usernames));
      } catch (err) {
        console.error("Error getting toy exchange:", err);
      }
    }
    getToyExchange();
  }, [currentUser.username]);
  useEffect(() => {
    console.log(sellerUsernames); // This will show the updated seller usernames
  }, [sellerUsernames]);
  return (
    <div className="ListingForm col-md-6 offset-md-3">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reviewed_username">Leave a review for</label>

          <select
            id="reviewed_username"
            name="reviewed_username"
            className="form-control"
            value={formData.reviewed_username}
            onChange={handleChange}
          >
            <option value=""></option>
            {sellerUsernames.map((sellerUsername) =>
              currentUser.username !== sellerUsername ? (
                <option key={sellerUsername} value={sellerUsername}>
                  {sellerUsername}
                </option>
              ) : null
            )}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="review_text">Text</label>
          <textarea
            name="review_text"
            className="form-control"
            value={formData.review_text}
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

export default ReviewForm;
