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

router
  .route("/register")
  .post(verifyJWT, authorizeRole(["super-admin", "admin"]), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logout);
router
  .route("/getUsers")
  .post(
    verifyJWT,
    authorizeRole(["super-admin", "admin", "manager"]),
    getUsers
  );
router
  .route("/delete/:id")
  .delete(verifyJWT, authorizeRole(["super-admin", "admin"]), deleteUser);
router
  .route("/role/:id")
  .post(verifyJWT, authorizeRole(["super-admin", "admin"]), assignRole);

router
  .route("/edit/:id")
  .post(verifyJWT, authorizeRole(["super-admin", "admin"]), editUser);

router
  .route("/uprofile")
  .patch(verifyJWT, authorizeRole(["normal-user"]), updateProfile);
router
  .route("/upass")
  .patch(verifyJWT, authorizeRole(["normal-user"]), updatePassword);

router.route("/profile").get(verifyJWT, authorizeRole(["normal-user"]), whoAmI);
router
  .route("/create-team")
  .post(verifyJWT, authorizeRole(["manager"]), createTeam);
router
  .route("/get-team")
  .get(verifyJWT, authorizeRole(["manager"]), getAllTeam);
router
  .route("/get-team/:id")
  .get(verifyJWT, authorizeRole(["manager"]), getTeam);
router
  .route("/delete-team/:id")
  .delete(verifyJWT, authorizeRole(["manager"]), deleteTeam);
router
  .route("/add-user-to-team/:teamId/:userId")
  .post(verifyJWT, authorizeRole(["manager"]), addUserToTeam);
router
  .route("/remove-user-from-team/:teamId/:userId")
  .delete(verifyJWT, authorizeRole(["manager"]), removeUserFromTeam);

router
  .route("/user-with-team")
  .post(verifyJWT, authorizeRole(["manager"]), userWithTeam);

router
  .route("/member-of-team/:teamId/:userId")
  .get(verifyJWT, authorizeRole(["manager"]), isAlreadyMemberOfTeam);
export default router;
