import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../userSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state: { user } = {} } = useLocation();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/v1/users/uprofile", {
        method: "PATCH",
        body: JSON.stringify({ name, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        dispatch(logout());
        alert("Logout Successful");
        setName("");
        setEmail("");
        navigate("/login");
      } else {
        throw new Error("Failed to logout profile");
      }
    } catch (error) {
      console.error("Error logout user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleFormSubmit}
        className="max-w-lg w-full mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">User Profile</h2>

        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="w-1/3 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Save Profile
          </button>
          <button
            type="button"
            className="w-1/3 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
