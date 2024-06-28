import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import ListingList from "../listings/ListingList";
import ListingDetail from "../listings/ListingDetail";
import LoginForm from "../auth/LoginForm";
import ProfileForm from "../profiles/ProfileForm";
import SignupForm from "../auth/SignupForm";
import PrivateRoute from "./PrivateRoute";
import NewListingForm from "../listings/NewListingForm";
import EditListingForm from "../listings/EditListingForm";
import SellerReviews from "../reviews/SellerReviews";
import ReviewForm from "../reviews/ReviewForm";

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function AppRoutes({ login, signup }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`
  );

  return (
    <div className="pt-5">
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route path="/login" element={<LoginForm login={login} />} />

        <Route path="/signup" element={<SignupForm signup={signup} />} />

        <Route
          path="/listings"
          element={
            <PrivateRoute>
              <ListingList type="all" />
            </PrivateRoute>
          }
        />

        <Route
          path="/my_listings"
          element={
            <PrivateRoute>
              <ListingList type="mine" />
            </PrivateRoute>
          }
        />

        <Route
          path="/my_listings/new"
          element={
            <PrivateRoute>
              <NewListingForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/liked_listings"
          element={
            <PrivateRoute>
              <ListingList type="liked" />
            </PrivateRoute>
          }
        />

        <Route
          path="/listings/:id"
          element={
            <PrivateRoute>
              <ListingDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/listings/:id/edit"
          element={
            <PrivateRoute>
              <EditListingForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/reviews/users/:username"
          element={
            <PrivateRoute>
              <SellerReviews />
            </PrivateRoute>
          }
        />

        <Route
          path="/reviews/new"
          element={
            <PrivateRoute>
              <ReviewForm />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default AppRoutes;
