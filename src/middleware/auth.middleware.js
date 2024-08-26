import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      res
        .status(401)
        .json({ message: "No user found with that refresh token" });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: error.message || "Invalid Api access token" });
  }
};
