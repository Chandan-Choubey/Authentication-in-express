import { User } from "../models/user.model.js";
import validator from "validator";
import { Team } from "../models/team.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!validator.isAlphanumeric(name, "en-US", { ignore: " " })) {
      return res.status(400).json({ message: "Name must be alphanumeric." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const user = await User.create({ name, email, password, role });
    return res.status(201).json({ message: "User created.", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = await user.generateAccessToken();
    const loggedInUser = await User.findById(user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 1000 * 60 * 60 * 24,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        message: "User LoggedIn",
        data: { user: loggedInUser, accessToken },
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = { httpOnly: true, secure: true };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .json({ message: "User logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields = { name };
    if (email && email !== currentUser.email) {
      updatedFields.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Profile updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashedPassword },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Password updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "Users fetched", data: users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const editUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, role } = req.body;

  try {
    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const assignRole = async (req, res) => {
  const id = req.params.id;
  const { role } = req.body;

  try {
    if (!role) {
      return res.status(400).json({ message: "Role is required." });
    }

    if (req.user.role === "admin" && role === "super-admin") {
      return res
        .status(403)
        .json({ message: "Admin cannot assign super-admin role." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User role updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted", data: deletedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const whoAmI = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User fetched", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const createTeam = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const team = await Team.create({ name });
    return res.status(201).json({ message: "Team created", data: team });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getTeam = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ message: "Team ID is required." });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    return res.status(200).json({ message: "Team fetched", data: team });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllTeam = async (req, res) => {
  try {
    const teams = await Team.find();
    if (!teams) {
      return res.status(404).json({ message: "No teams found." });
    }

    return res.status(200).json({ message: "Teams fetched", data: teams });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateTeam = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "Team ID is required." });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found." });
    }

    return res.status(200).json({ message: "Team updated", data: updatedTeam });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteTeam = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(400).json({ message: "Team ID is required." });
    }

    const deletedTeam = await Team.findByIdAndDelete(id);
    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found." });
    }

    return res.status(200).json({ message: "Team deleted", data: deletedTeam });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const addUserToTeam = async (req, res) => {
  const { userId, teamId } = req.params;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
    }

    return res
      .status(200)
      .json({ message: "Member added to team.", data: team });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const removeUserFromTeam = async (req, res) => {
  const { teamId, userId } = req.params;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    team.members = team.members.filter(
      (member) => member.toString() !== userId
    );
    await team.save();

    return res
      .status(200)
      .json({ message: "Member removed from team.", data: team });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const userWithTeam = async (req, res) => {
  try {
    const teamsWithUsers = await Team.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "membersDetails",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          membersDetails: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
          },
        },
      },
    ]);

    return res
      .status(200)
      .json({ message: "Teams with users fetched", data: teamsWithUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const isAlreadyMemberOfTeam = async (req, res) => {
  const { teamId, userId } = req.params;
  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    const isMember = team.members.includes(userId);
    return res.status(200).json({ isMember });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export {
  registerUser,
  loginUser,
  assignRole,
  logout,
  getUsers,
  updatePassword,
  updateProfile,
  editUser,
  deleteUser,
  whoAmI,
  createTeam,
  getTeam,
  getAllTeam,
  updateTeam,
  deleteTeam,
  addUserToTeam,
  removeUserFromTeam,
  userWithTeam,
  isAlreadyMemberOfTeam,
};
