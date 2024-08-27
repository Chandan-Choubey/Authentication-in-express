import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import SignupPage from "./components/SignupPage.jsx";
import SuperAdmin from "./components/SuperAdmin.jsx";
import Manager from "./components/Manager.jsx";
import NormalUser from "./components/NormalUser.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import EditUser from "./components/EditUser.jsx";
import AddMember from "./components/AddMember.jsx";
import MyProfile from "./components/MyProfile.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/sign-up",
        element: <SignupPage />,
      },
      {
        path: "/super-admin",
        element: <SuperAdmin />,
      },
      {
        path: "/admin",
        element: <SuperAdmin />,
      },
      {
        path: "/manager",
        element: <Manager />,
      },
      {
        path: "/normal-user",
        element: <NormalUser />,
      },
      {
        path: "/edit-user/:id",
        element: <EditUser />,
      },
      {
        path: "/add-team-member/:id",
        element: <AddMember />,
      },
      {
        path: "/profile",
        element: <MyProfile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
