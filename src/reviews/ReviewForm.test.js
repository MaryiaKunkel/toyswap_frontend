// import React from "react";
// import { render, waitFor, screen } from "@testing-library/react";
// import ReviewForm from "./ReviewForm";
// import { MemoryRouter } from "react-router";
// import UserContext from "../auth/UserContext";
// const currentUser = {
//   username: "testuser",
// };

// it("renders without crashing", () => {
//   render(
//     <MemoryRouter>
//       <UserContext.Provider value={{ currentUser }}>
//         <ReviewForm />
//       </UserContext.Provider>
//     </MemoryRouter>
//   );
// });

// it("loads and displays seller usernames", async () => {
//   render(
//     <MemoryRouter>
//       <UserContext.Provider value={{ currentUser }}>
//         <ReviewForm />
//       </UserContext.Provider>
//     </MemoryRouter>
//   );
//   await waitFor(() => {
//     expect(screen.getByText("seller1")).toBeInTheDocument();
//     // expect(screen.getByText("seller2")).toBeInTheDocument();
//   });
// });
