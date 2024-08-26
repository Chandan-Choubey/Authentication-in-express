import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const SuperAdmin = () => {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [users, setUsers] = useState([]);
  const allUser = async () => {
    const user = await fetch("/api/v1/users/getUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await user.json();
    setUsers(data.data);
  };
  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      await fetch(`/api/v1/users/delete/${userId}`, {
        method: "DELETE",
      });

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    }
  };

  useEffect(() => {
    allUser();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen p-4">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className=" text-2xl">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Edit User</th>
              <th className="p-4 text-left">Delete User</th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="p-4 text-xl">{user.name}</td>
                <td className="p-4 text-xl">{user.email}</td>
                <td className="p-4 text-xl">{user.role}</td>
                <td className="p-4 text-xl text-center">
                  <Link to={`/edit-user/${user._id}`} state={{ user }}>
                    Edit
                  </Link>
                </td>
                <td className="p-4 text-xl text-center">
                  <Link onClick={() => handleDeleteUser(user._id)}>Delete</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdmin;
