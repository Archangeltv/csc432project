"use client";
import React from "react";
import Link from "next/link";
import { Typography, Dropdown, MenuButton, Menu, MenuItem } from "@mui/joy";
import { user } from "@/lib/authHandlers";
import jwt from "jsonwebtoken";

import { handleSignout } from "@/lib/authHandlers";

//Icons
import { Person } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LinkIcon from "@mui/icons-material/Link";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export function Navbar() {
  return (
    <nav
      className={`w-full  h-[75px] flex items-center px-5 md:px-10 justify-between`}
    >
      <Link
        name="nav-logo"
        className="font-semibold text-[.8em] md:text-[1.2em]"
        href="/"
      >
        <Typography>
          <i className="fa-solid fa-link"></i> TinyClicks
        </Typography>
      </Link>

      <div
        name="nav-right"
        className="flex items-center gap-4 md:gap-10 text-[.8em] md:text-[1.2em]"
      >
        <Link
          className="hover:text-gray-600 transition-all duration-200"
          href="/dashboard"
        >
          <Typography fontWeight={500}>Dashboard</Typography>
        </Link>
        <Link
          className="hover:text-gray-600 transition-all duration-200"
          href="/features"
        >
          <Typography fontWeight={500}>Features</Typography>
        </Link>
        {user && (
          <Dropdown>
            <MenuButton variant="plain" endDecorator={<ArrowDropDownIcon />}>
              <Person color="grey" />
            </MenuButton>
            <Menu>
              <MenuItem>
                <Person />
                Profile
              </MenuItem>
              <MenuItem>
                <DashboardIcon />
                Dashboard
              </MenuItem>
              <MenuItem>
                <LinkIcon />
                My Links
              </MenuItem>

              <MenuItem>
                <SettingsIcon />
                Settings
              </MenuItem>
              <MenuItem onClick={handleSignout}>
                <ExitToAppIcon />
                Sign Out
              </MenuItem>
            </Menu>
          </Dropdown>
        )}
        {!user && (
          <>
            <Link
              className="hover:text-gray-600 transition-all duration-200"
              href="/register"
            >
              <Typography fontWeight={500}>Register</Typography>
            </Link>
            <Link
              className="hover:text-gray-600 transition-all duration-200"
              href="/login"
            >
              <Typography fontWeight={500}>Login</Typography>
            </Link>
          </>
        )}
        <div class="group relative flex justify-center">
          <button
            className="bg-payne-gray hover:bg-delft-blue text-white font-semibold py-1 px-2 md:py-2 md:px-4 rounded-full transition-all duration-200"
            onClick={() => {
              window.location.assign("/subscribe");
            }}
          >
            <Typography color="white">Premium</Typography>
          </button>
          <span class="absolute top-10 scale-0 rounded bg-delft-blue p-2 text-xs text-white group-hover:scale-100 transition-all duration-100">
            ✨ Coming Soon!
          </span>
        </div>
      </div>
    </nav>
  );
}
