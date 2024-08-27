import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/login">Super Admin</Link>
            </li>
            <li>
              <Link to="/login">Admin</Link>
            </li>
            <li>
              <Link to="/login">Manager</Link>
            </li>
            <li>
              <Link to="/login">Normal User</Link>
            </li>
          </ul>
        </div>
        <Link to="/login" className="btn btn-ghost text-xl">
          Vivaansh
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/login">Super Admin</Link>
          </li>
          <li>
            <Link to="/login">Admin</Link>
          </li>
          <li>
            <Link to="/login">Manager</Link>
          </li>
          <li>
            <Link to="/login">Normal User</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        {isLoggedIn ? (
          user?.role === "super-admin" ? (
            <Link to="/sign-up" className="btn">
              Create User
            </Link>
          ) : (
            <Link to="/profile" state={{ user }} className="btn">
              {`Welcome, ${user.name}`}
            </Link>
          )
        ) : (
          <Link to="/login" className="btn">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
