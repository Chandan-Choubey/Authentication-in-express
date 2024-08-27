import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function NormalUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/v1/users/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center align-middle h-[50vh]">
      <div className="card bg-primary text-primary-content w-96">
        <div className="card-body">
          <h2 className="card-title py-4">{user?.name}'s Profile</h2>
          <p>
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user?.role || "N/A"}
          </p>
          <div className="card-actions justify-end">
            <Link className="btn" state={{ user }} to="/profile">
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NormalUser;
