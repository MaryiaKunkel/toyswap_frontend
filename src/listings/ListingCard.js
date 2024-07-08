import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import ToyswapApi from "../api/api";

import "./ListingCard.css";

/** Show limited information about a listing
 *
 * Is rendered by ListingList to show a "card" for each listing.
 *
 * ListingList -> ListingCard
 */

function ListingCard({ id, title, description, image_url, type, onDelete }) {
  console.debug("ListingCard", image_url);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [listing, setListing] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  function checkIfLiked() {
    let liked = false;
    currentUser.liked_listings.forEach((listing) => {
      if (+listing.listing_id === +id) {
        console.log(listing.listing_id, "=", id);
        console.log("should be liked");
        liked = true;
      }
    });
    setIsLiked(liked);
  }
  useEffect(() => {
    checkIfLiked();
  }, [currentUser]);

  useEffect(
    function getListingForUser() {
      async function getListing() {
        const listingData = await ToyswapApi.getListing(id);
        setListing(listingData);
      }

      getListing();
    },
    [id]
  );

  const handleFavoriteToggle = async () => {
    try {
      if (currentUser.username && listing.id) {
        if (isLiked) {
          await ToyswapApi.removeLikedListing(listing.id);
          alert("Listing removed from favorites");
        } else {
          await ToyswapApi.addLikedListing(listing.id);
          alert("Listing added to favorites");
        }
        const updatedUser = await ToyswapApi.getCurrentUser(
          currentUser.username
        );
        setCurrentUser(updatedUser);
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error("Failed to update favorites", err);
      alert("Failed to update favorites");
    }
  };

  const deleteListing = async () => {
    try {
      if (
        currentUser.username === listing.shared_by_username &&
        type === "mine"
      ) {
        await ToyswapApi.deleteListing(listing.id);
        alert("Listing deleted");
        onDelete(listing.id);
      }
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing");
    }
  };

  return (
    <div className="ListingCard">
      <Link className="card" to={`/listings/${id}`}>
        <div className="card-body">
          <h3 className="card-title">{title}</h3>
          {image_url && (
            <div className="card-img-wrapper">
              <img src={image_url} alt={title} className="card-img" />
            </div>
          )}

          <p>
            <small className="card-description">{description}</small>
          </p>
        </div>
      </Link>
      {type !== "mine" ? (
        <button className="card-favor-button" onClick={handleFavoriteToggle}>
          {isLiked ? "Remove from favorites" : "Add to favorites"}
        </button>
      ) : null}
      {type === "mine" ? (
        <>
          <button onClick={deleteListing}>Delete listing</button>
          <button>
            <Link to={`/listings/${id}/edit`}>Edit listing</Link>
          </button>
        </>
      ) : null}
    </div>
  );
}

export default ListingCard;
