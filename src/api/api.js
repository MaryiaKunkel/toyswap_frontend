import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class ToyswapApi {
  // the token for interactive with the API will be stored here.
  static token = localStorage.getItem("token");

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${ToyswapApi.token}` };
    const params = method === "get" ? data : {};
    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.log("Error Object: ", err);
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes
  /** Get a list of listings. */

  static async getListings(id) {
    let res = await this.request(`listings`, { id });
    return res.listings;
  }

  static async getListingsSearch(title) {
    let res = await this.request("listings", { title });
    return res.listings;
  }

  // Update listing availability
  static async updateListingAvailability(id, available) {
    let res = await this.request(`listings/${id}`, { available }, "patch");
    return res.listing;
  }

  /** Get a user. */

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get a list of users. */

  static async getUsersList() {
    let res = await this.request(`users`);
    return res;
  }

  /** Get liked_listings. */

  static async getFavorites(id) {
    let res = await this.request(`listings/${id}`);
    return res.listing;
  }

  /** Get details on a listing by id. */

  static async getListing(id) {
    let res = await this.request(`listings/${id}`);
    console.log(res);
    return res.listing;
  }

  /** Get seller reviews. */

  static async getReviewsList(username) {
    let res = await this.request(`reviews/users/${username}`);
    return res.reviews;
  }

  /** Create a review. */

  static async createReview(data) {
    console.log(data);
    let res = await this.request(`reviews/new`, data, "post");
    console.log(res);
    return res;
  }

  /** Delete listing. */

  static async deleteListing(id) {
    await this.request(`listings/${id}`, {}, "delete");
  }

  static async updateListing(id, data) {
    let res = await this.request(`listings/${id}`, data, "patch");
    return res;
  }

  /** Create a listing. */

  static async createListing(data) {
    try {
      const res = await this.request("listings", data, "post");
      return res;
    } catch (err) {
      console.error("Error creating listing:", err);
      throw err;
    }
  }

  /** Get to liked listings. */

  static async getLikedListing(listingId) {
    let res = await this.request(`liked-listings/${listingId}`);
    return res;
  }

  /** Add to liked listings. */

  static async addLikedListing(listingId) {
    let res = await this.request(`liked-listings/${listingId}`, {}, "post");
    console.log("Response from adding liked listing:", res);
    return res;
  }

  /** Remove from liked listings. */

  static async removeLikedListing(listingId) {
    let res = await this.request(`liked-listings/${listingId}`, {}, "delete");
    console.log("sfg");
    return res;
  }

  /** Get details on a user by username. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Sign up a new user. */
  static async signUp(userData) {
    console.log("UserData: ", userData);
    let res = await this.request(`auth/register`, userData, "post");
    console.log("res in signUp api.js: ", res);
    ToyswapApi.token = res.token;
    return ToyswapApi.token;
  }

  /** Log in a user. */
  static async logIn(userData) {
    let res = await this.request(`auth/token`, userData, "post");
    ToyswapApi.token = res.token;
    return ToyswapApi.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}

export default ToyswapApi;
