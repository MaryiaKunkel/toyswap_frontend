import React, { useState, useEffect, useContext } from "react";
import SearchForm from "../common/SearchForm";
import ToyswapApi from "../api/api";
import ListingCard from "./ListingCard";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";
import { Link } from "react-router-dom";

/** Show page with list of companies.
 *
 * On mount, loads listings from API.
 * Re-loads filtered listings on submit from search form.
 *
 * This is routed to at /listings
 *
 * Routes -> { ListingCard, SearchForm }
 */

function ListingList({ type }) {
  console.debug("ListingList", "type=", type);

  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(UserContext);

  useEffect(
    function getListingsOnMount() {
      console.debug("ListingList useEffect getListingsOnMount");
      loadListings();
    },
    [type]
  );

  async function loadListings() {
    setIsLoading(true);
    let listings;
    try {
      if (type === "liked") {
        const likedListingsIds = currentUser.liked_listings;
        console.log(likedListingsIds);
        listings = await Promise.all(
          likedListingsIds.map(async (likedId) => {
            let listinId = likedId.listing_id;
            const listing = await ToyswapApi.getListing(listinId);
            return listing;
          })
        );
      } else if (type === "mine") {
        const user = await ToyswapApi.getCurrentUser(currentUser.username);
        listings = user.listings;
      } else {
        listings = await ToyswapApi.getListings();
      }
      setListings(listings);
    } catch (err) {
      console.error("Error loading listings:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function search(searchTerm) {
    const filteredListings = listings.filter((listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setListings(filteredListings);
  }

  const handleDelete = (id) => {
    setListings((listings) => listings.filter((listing) => listing.id !== id));
  };

  return (
    <div className="ListingList col-md-8 offset-md-2">
      {type === "mine" && (
        <div className="my-3">
          <button>
            <Link to="/my_listings/new" className="btn btn-primary">
              Create a Listing
            </Link>
          </button>
        </div>
      )}
      <SearchForm searchFor={search} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          {listings && listings.length ? (
            <div className="ListingList-list">
              {listings.map((listing) => (
                <ListingCard
                  id={listing.id}
                  title={listing.title}
                  description={listing.description}
                  image_url={listing.image_url}
                  type={type}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <p className="lead">Sorry, no results were found!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ListingList;
