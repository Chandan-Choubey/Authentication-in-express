import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddMember = () => {
  const location = useLocation();
  const { teamData } = location.state || {};
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(
    teamData?.membersDetails?.name || ""
  );
  const [selectedUser, setSelectedUser] = useState(teamData?.name || "");
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const navigate = useNavigate();

  const handleFetchError = (error) => console.error("Fetch Error:", error);

  const fetchAllData = useCallback(async () => {
    try {
      const [usersResponse, teamsResponse] = await Promise.all([
        fetch("/api/v1/users/getUsers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
        fetch("/api/v1/users/get-team", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);

      if (!usersResponse.ok || !teamsResponse.ok)
        throw new Error("Failed to fetch data");

      const usersData = await usersResponse.json();
      const teamsData = await teamsResponse.json();

      setUsers(usersData.data);
      setTeams(teamsData.data);
    } catch (error) {
      handleFetchError(error);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleFormSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      try {
        const isMember = await isAlreadyMember(selectedTeam, selectedUser);
        if (isMember) {
          alert("This user is already a member of the selected team.");
          return;
        }

        const response = await fetch(
          `/api/v1/users/add-user-to-team/${selectedTeam}/${selectedUser}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          alert("Member added successfully!");
          navigate("/manager");
        } else {
          throw new Error("Failed to add member");
        }
      } catch (error) {
        handleFetchError(error);
      }
    },
    [selectedTeam, selectedUser, navigate]
  );

  const isAlreadyMember = useCallback(async (teamId, userId) => {
    try {
      const response = await fetch(
        `/api/v1/users/member-of-team/${teamId}/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to check membership");
      const res = await response.json();

      return res.isMember;
    } catch (error) {
      handleFetchError(error);
      return false;
    }
  }, []);

  const handleAddTeam = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/users/create-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTeamName }),
      });

      if (response.ok) {
        const newTeam = await response.json();
        setTeams((prevTeams) => [...prevTeams, newTeam]);
        setSelectedTeam(newTeam._id);
        setShowAddTeamModal(false);
        setNewTeamName("");
      } else {
        throw new Error("Failed to add team");
      }
    } catch (error) {
      handleFetchError(error);
    }
  }, [newTeamName]);

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleFormSubmit} className="max-w-lg w-full mx-auto">
        <div className="mb-5">
          <label
            htmlFor="team"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Team
          </label>
          <select
            id="team"
            name="team"
            value={selectedTeam}
            onChange={(e) => {
              if (e.target.value === "add-new") setShowAddTeamModal(true);
              else setSelectedTeam(e.target.value);
            }}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="">Select a Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
            <option value="add-new">Add New Team</option>
          </select>
        </div>

        <div className="mb-5">
          <label
            htmlFor="user"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select User
          </label>
          <select
            id="user"
            name="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Add Member
        </button>
      </form>

      {showAddTeamModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Add New Team</h3>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddTeam}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Add Team
            </button>
            <button
              onClick={() => setShowAddTeamModal(false)}
              className="text-gray-700 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMember;
