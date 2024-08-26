import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ProfilePage = () => {
  const location = useLocation();
  const { user } = location.state;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log({ name, email });
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
            onChange={(e) => {
              setName(e.target.value);
            }}
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
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
