import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/role.middleware.js";
import {
  addUserToTeam,
  assignRole,
  createTeam,
  deleteTeam,
  deleteUser,
  editUser,
  getAllTeam,
  getTeam,
  getUsers,
  isAlreadyMemberOfTeam,
  loginUser,
  logout,
  registerUser,
  removeUserFromTeam,
  updatePassword,
  updateProfile,
  userWithTeam,
  whoAmI,
} from "../controllers/user.controller.js";

const router = Router();

// User Routes
router.post(
  "/register",
  verifyJWT,
  authorizeRole(["super-admin", "admin"]),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logout);
router.post(
  "/getUsers",
  verifyJWT,
  authorizeRole(["super-admin", "admin", "manager"]),
  getUsers
);
router.delete(
  "/delete/:id",
  verifyJWT,
  authorizeRole(["super-admin", "admin"]),
  deleteUser
);
router.post(
  "/role/:id",
  verifyJWT,
  authorizeRole(["super-admin", "admin"]),
  assignRole
);
router.post(
  "/edit/:id",
  verifyJWT,
  authorizeRole(["super-admin", "admin"]),
  editUser
);
router.patch(
  "/uprofile",
  verifyJWT,
  authorizeRole(["normal-user"]),
  updateProfile
);
router.patch(
  "/upass",
  verifyJWT,
  authorizeRole(["normal-user"]),
  updatePassword
);
router.get("/profile", verifyJWT, authorizeRole(["normal-user"]), whoAmI);

// Team Routes
router.post("/create-team", verifyJWT, authorizeRole(["manager"]), createTeam);
router.get("/get-team", verifyJWT, authorizeRole(["manager"]), getAllTeam);
router.get("/get-team/:id", verifyJWT, authorizeRole(["manager"]), getTeam);
router.delete(
  "/delete-team/:id",
  verifyJWT,
  authorizeRole(["manager"]),
  deleteTeam
);
router.post(
  "/add-user-to-team/:teamId/:userId",
  verifyJWT,
  authorizeRole(["manager"]),
  addUserToTeam
);
router.delete(
  "/remove-user-from-team/:teamId/:userId",
  verifyJWT,
  authorizeRole(["manager"]),
  removeUserFromTeam
);
router.post(
  "/user-with-team",
  verifyJWT,
  authorizeRole(["manager"]),
  userWithTeam
);
router.get(
  "/member-of-team/:teamId/:userId",
  verifyJWT,
  authorizeRole(["manager"]),
  isAlreadyMemberOfTeam
);

export default router;
