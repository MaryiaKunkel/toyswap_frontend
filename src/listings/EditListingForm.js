import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ToyswapApi from "../api/api";
import UserContext from "../auth/UserContext";
import LoadingSpinner from "../common/LoadingSpinner";

/** Form to edit an existing listing.
 *
 * On mount, loads the listing data from the API and fills the form with it.
 * On submit, sends the updated data to the API.
 *
 * Routed at /listings/:id/edit
 *
 * Routes -> EditListingForm
 */

function EditListingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    available: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function loadListingData() {
      async function getListing() {
        try {
          const listing = await ToyswapApi.getListing(id);
          if (listing.shared_by_username !== currentUser.username) {
            alert("You cannot edit this listing.");
            navigate("/");
          }
          setFormData({
            title: listing.title,
            description: listing.description,
            image_url: listing.image_url,
            available: listing.available,
          });
          setIsLoading(false);
        } catch (err) {
          console.error("Failed to load listing", err);
          alert("Failed to load listing");
          navigate("/");
        }
      }
      getListing();
    },
    [id]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ToyswapApi.updateListing(id, formData);
      alert("Listing updated successfully");
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Failed to update listing", err);
      alert("Failed to update listing");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="EditListingForm col-md-8 offset-md-2">
      <h3>Edit Listing</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image URL</label>
          <input
            type="text"
            id="image_url"
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
            id="available"
            name="available"
            className="form-control"
            value={formData.available}
            checked={formData.available}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditListingForm;
