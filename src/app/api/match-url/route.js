import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../prisma";
import { domain } from "@/lib/domain";
import qs from "qs";

export async function GET(request) {
  let originalURL;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const slug = searchParams.get("slug");

  const urlRecord = await Prisma.Link.findFirst({
    where: {
      shortURL: domain + slug,
    },
    select: {
      originalURL: true,
      id: true,
    },
  });
  if (urlRecord) {
    originalURL = urlRecord.originalURL;
  } else {
    return new NextResponse(
      JSON.stringify({ error: "No matching url found" }),
      {
        status: 404,
      }
    );
  }
  const ip = searchParams.get("ip");
  const userInfo = await logUserInfo(ip);
  console.log(userInfo);

  const source = searchParams.get("source");
  console.log("Source " + source);

  await Prisma.Traffic.create({
    data: {
      link: {
        connect: {
          id: urlRecord.id,
        },
      },
      location: userInfo,
    },
  });
  return new NextResponse(
    JSON.stringify({ url: originalURL, message: "MATCH FOUND" }),
    {
      status: 200,
    }
  );
}

function doesExistJSON(url) {
  //Returns JSON object with information pertaining to whether the url exists in any database and which db it belongs to.
  //TODO: This function
  const exists = false; //False if doesn't exist in either database.
  const isPremium = false; //False if found in in liteURL database, True if not in liteURL but in premiumURL database
  return {
    exists: exists,
    isPremium: isPremium,
  };
}

// Promise wrapper for ipstack
function getGeoInfo(ip, apiKey) {
  const ipstack = require("ipstack");
  return new Promise((resolve, reject) => {
    ipstack(ip, apiKey, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

async function logUserInfo(ip) {
  try {
    const userInfo = await getGeoInfo(ip, process.env.NEXT_PUBLIC_IPSTACK_API);
    return userInfo;
  } catch (error) {
    console.error("Error fetching geolocation data:", error);
  }
}
