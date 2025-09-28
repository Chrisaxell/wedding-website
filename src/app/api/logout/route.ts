import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function GET(req: Request) {
  clearSessionCookie();
  return NextResponse.redirect(new URL("/wedding", req.url));
}
