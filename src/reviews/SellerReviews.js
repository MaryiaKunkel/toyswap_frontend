import React, { useState, useContext, useEffect } from "react";
import ToyswapApi from "../api/api";
import UserContext from "../auth/UserContext";
import { useParams } from "react-router-dom";
import "./SellerReviews.css";

function SellerReviews() {
  const { currentUser } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    async function getReviews() {
      const res = await ToyswapApi.getReviewsList(username);
      console.log(res);
      setReviews(res);
    }
    getReviews();
  }, [username]);

  return (
    <div className="SellerReviews">
      <h3>{username} reviews:</h3>
      <div className="card">
        <div className="card-body">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="review-card">
                <p>Reviewer: {review.reviewer_username}</p>
                <p>
                  <i>{review.review_text}</i>
                </p>
                <p>Date of the review: {review.review_date}</p>
                <br></br>
              </div>
            ))
          ) : (
            <p>No reviews were found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerReviews;
