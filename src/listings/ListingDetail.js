import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ToyswapApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";

/** Listing Detail page.
 *
 * Renders information about listing.
 *
 * Routed at /listings/:id
 *
 * Routes -> ListingDetail
 */

function ListingDetail() {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);

  console.debug("ListingDetails", "currentUser=", currentUser);
  // console.debug("ListingDetail", "id=", id);

  const [listing, setListing] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");
  const [sellerEmail, setSellerEmail] = useState("");
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
  }, [currentUser.liked_listings]);

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

  useEffect(
    function getSellerEmail() {
      async function getUser() {
        if (listing && listing.shared_by_username) {
          const userData = await ToyswapApi.getUser(listing.shared_by_username);
          setSellerEmail(userData.email);
        }
      }
      getUser();
    },
    [listing]
  );

  const handleChange = (event) => {
    setEmailMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (listing && listing.shared_by_username) {
      const mailtoLink = `mailto:${sellerEmail}?subject=Inquiry about ${
        listing.title
      }&body=${encodeURIComponent(emailMessage)}`;
      window.location.href = mailtoLink;
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (currentUser.username && listing.id) {
        if (isLiked) {
          await ToyswapApi.removeLikedListing(listing.id);
          alert("Listing removed from favorites");
        } else {
          const res = await ToyswapApi.addLikedListing(listing.id);
          console.log("Add liked listing response:", res);
          alert("Listing added to favorites");
        }
        setIsLiked(!isLiked);
      }
    } catch (err) {
      console.error("Failed to update favorites", err);
      alert("Failed to update favorites");
    }
  };

  if (!listing) return <LoadingSpinner />;

  return (
    <div className="ListingDetail col-md-8 offset-md-2">
      <h4>{listing.title}</h4>
      <button onClick={handleFavoriteToggle}>
        {isLiked ? "Remove from favorites" : "Add to favorites"}
      </button>{" "}
      <p>{listing.description}</p>
      {listing.available ? <p>Available for pickup</p> : <p>Not available</p>}
      <img src={listing.image_url} alt={listing.title}></img>
      <p>
        Pickup location: {listing.address.state}, {listing.address.city}
      </p>
      {currentUser.username !== listing.shared_by_username ? (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="emailMessage">Send seller an email:</label>
            <input
              type="text"
              id="emailMessage"
              name="emailMessage"
              value={emailMessage}
              onChange={handleChange}
              placeholder="Hi, is this available?"
              className="form-control"
            />
            <button type="submit" className="btn btn-primary mt-2">
              Send an email
            </button>
          </form>
          <Link to={`/reviews/users/${listing.shared_by_username}`}>
            See reviews of this seller
          </Link>
        </>
      ) : null}
    </div>
  );
}

export default ListingDetail;
