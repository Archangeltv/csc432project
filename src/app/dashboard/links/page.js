"use client";
import React from "react";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/authHandlers";
import { Tooltip } from "@mui/joy";
import { getTime, getDate } from "@/lib/time";
import { ENVIRONMENT } from "@/lib/constants";

import CircularProgress from "@mui/joy";

import {
  Sheet,
  Table,
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Input,
  Button,
} from "@mui/joy";

import EditIcon from "@mui/icons-material/Edit";

export default function Links() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isAliasOpen, setIsAliasOpen] = useState(false);

  const [newName, setNewName] = useState(null);
  const [newAlias, setNewAlias] = useState(null);
  const [loading, setLoading] = useState(true);
  const [renameRes, setRenameRes] = useState(null);

  const [error, setError] = useState(null);
  //Data States
  const [topPerformers, setTopPerformers] = useState(null);

  async function assignUser() {
    const userData = getUser(); // Fetch user data
    setUser(userData); // Set user data to state
    return userData; // Return the user data
  }
  useEffect(() => {
    async function fetchData() {
      const assignedUser = await assignUser();
      if (assignedUser) {
        fetch("/api/dash/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: assignedUser.id,
          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((info) => {
            setData(info);
          });
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleModify(operation) {
    const value = operation === "alias" ? newAlias : newName;
    setLoading(true);
    fetch("/api/dash/links/modify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation,
        value,
        selectedShort: data.data[selectedLink].shortURL,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((info) => {
        setRenameRes(info);
        if (info.status == 200) {
          {
            setIsAliasOpen(false);
            setIsRenameOpen(false);
          }
        }
      })
      .finally(window.location.reload());
  }

  return (
    <main className="w-full h-full">
      <div className="h-[320px] p-4 flex border w-full"></div>
      <div className="h-[320px] p-4 flex border w-full">
        <Sheet
          sx={{
            width: "700px",
            height: "100%",
            boxShadow: 3,
            padding: "16px",
          }}
          className={"rounded-[1.5rem] shadow-lg"}
        >
          <h2 className="text-[2em] font-bold">Links</h2>
          <hr />
          {data && (
            <>
              {selectedLink === null && (
                <div className="pt-1">
                  {data.data.map((link, i) => {
                    let name;
                    if (link.name) {
                      name = link.name;
                    } else {
                      name = link.originalURL;
                      name = name.slice(
                        name.indexOf("/") + 2,
                        name.indexOf(".")
                      );
                    }

                    return (
                      <button
                        key={`link-${i}`}
                        className="w-full h-[40px] flex items-center hover:bg-slate-100"
                        onClick={() => {
                          setSelectedLink(i);
                        }}
                      >
                        <div
                          href=""
                          className="capitalize text-[1.25em] font-medium"
                        >
                          {name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedLink !== null && (
                <>
                  {" "}
                  <div
                    className="capitalize  text-[1.5em] "
                    onClick={() => {
                      setIsRenameOpen(true);
                    }}
                  >
                    {data.data[selectedLink].name ||
                      data.data[selectedLink].originalURL.slice(
                        data.data[selectedLink].originalURL.indexOf("/") + 2,
                        data.data[selectedLink].originalURL.indexOf(".")
                      )}{" "}
                    <EditIcon />
                  </div>
                  <Modal open={isRenameOpen}>
                    <ModalDialog>
                      <ModalClose
                        onClick={() => {
                          setIsRenameOpen(false);
                        }}
                      />
                      <Typography>Rename Link</Typography>
                      <hr />
                      <Input
                        type="text"
                        placeholder="Enter an identifying name"
                        onChange={(e) => {
                          setNewName(e.target.value);
                        }}
                      ></Input>
                      {renameRes && (
                        <div
                          className={`${
                            renameRes.status != 200 ? "bg-red-600" : ""
                          }`}
                        >
                          {renameRes.message}
                        </div>
                      )}
                      <Button
                        disabled={loading}
                        variant="outlined"
                        sx={{ width: "50%" }}
                        onClick={() => {
                          handleModify("name");
                        }}
                      >
                        Rename
                      </Button>
                    </ModalDialog>
                  </Modal>
                  <button
                    onClick={() => {
                      setIsAliasOpen(true);
                    }}
                    className="flex items-center gap-2 justify-center text-payne-gray hover:text-black transition-all duration-100"
                  >
                    {data.data[selectedLink].shortURL} <EditIcon />
                  </button>
                  <Modal open={isAliasOpen}>
                    <ModalDialog>
                      <ModalClose
                        onClick={() => {
                          setIsAliasOpen(false);
                        }}
                      />
                      <Typography>New Link Alias</Typography>
                      <hr />
                      <Input
                        startDecorator={
                          <Sheet>
                            {ENVIRONMENT === "dev"
                              ? "localhost:3000/"
                              : "tinyclicks.co/"}
                          </Sheet>
                        }
                        type="text"
                        placeholder=""
                        onChange={(e) => {
                          setNewAlias(e.target.value);
                        }}
                      ></Input>
                      {renameRes && (
                        <div
                          className={`${
                            renameRes.status != 200 ? "bg-red-600" : ""
                          }`}
                        >
                          {renameRes.message}
                        </div>
                      )}
                      <Button
                        variant="outlined"
                        sx={{ width: "50%" }}
                        disabled={loading}
                        onClick={() => {
                          handleModify("alias");
                        }}
                      >
                        {loading ? <CircularProgress /> : "Confirm"}
                      </Button>
                    </ModalDialog>
                  </Modal>
                  <Typography sx={{ opacity: ".75" }}>
                    Created on {getDate(data.data[selectedLink].createdAt)}{" "}
                    {getTime(data.data[selectedLink].createdAt)}
                  </Typography>
                  <Typography sx={{ opacity: ".75" }}>
                    Last modified at{" "}
                    {getDate(data.data[selectedLink].modifiedAt)}{" "}
                    {getTime(data.data[selectedLink].modifiedAt)}
                  </Typography>
                </>
              )}
            </>
          )}
        </Sheet>
      </div>
    </main>
  );
}
