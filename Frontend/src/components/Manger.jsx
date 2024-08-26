import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Manager = () => {
  const manager = useSelector((state) => state.user.user);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/users/user-with-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTeam(data);
    } catch (err) {
      setError("Failed to fetch team data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamMember = useCallback(async (memberId, teamId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this team member?"
    );
    if (confirmed) {
      try {
        await fetch(
          `/api/v1/users/remove-user-from-team/${teamId}/${memberId}`,
          {
            method: "DELETE",
          }
        );
        setTeam((prevTeam) =>
          prevTeam.map((team) =>
            team._id === teamId
              ? {
                  ...team,
                  membersDetails: team.membersDetails.filter(
                    (member) => member._id !== memberId
                  ),
                }
              : team
          )
        );
      } catch (err) {
        setError("Failed to remove the team member");
      }
    }
  }, []);

  useEffect(() => {
    if (team.length === 0) {
      fetchTeam();
    }
  }, [team]);

  const teamDataWithDetails = useMemo(
    () =>
      team.map((teamData) => ({
        ...teamData,
        membersDetails: teamData.membersDetails,
      })),
    [team]
  );

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto w-full px-4">
          <table className="min-w-full table-auto text-center">
            <thead className="bg-gray-800">
              <tr className="text-2xl">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Team Name</th>
                <th className="px-4 py-2">Add Team Member</th>
                <th className="px-4 py-2">Remove Team Member</th>
              </tr>
            </thead>
            <tbody>
              {teamDataWithDetails.map((teamData) => (
                <React.Fragment key={teamData._id}>
                  {teamData.membersDetails.length > 0 &&
                    teamData.membersDetails.map((member) => (
                      <tr key={member._id} className="text-xl">
                        <td className="px-4 py-2">{member.name}</td>
                        <td className="px-4 py-2">{member.email}</td>
                        <td className="px-4 py-2">{member.role}</td>
                        <td className="px-4 py-2">{teamData.name}</td>
                        <td className="px-4 py-2">
                          <Link
                            to={`/add-team-member/${member._id}`}
                            state={{ teamData }}
                            className="text-blue-600 hover:underline cursor-pointer"
                          >
                            Add
                          </Link>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            onClick={() =>
                              handleDeleteTeamMember(member._id, teamData._id)
                            }
                            className="text-red-600 hover:underline cursor-pointer"
                          >
                            Remove
                          </span>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Manager;
