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

  useEffect(() => {
    async function fetchUsers() {
      const users = await ToyswapApi.getUsersList();
      console.log(users.users);
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
      console.log(formData);
      await ToyswapApi.createReview(formData);
      navigate("/listings");
    } catch (err) {
      console.error("Error creating review:", err);
    }
  }

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
            {users.map((user) =>
              currentUser.username !== user.username ? (
                <option key={user.username} value={user.username}>
                  {user.username}
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
