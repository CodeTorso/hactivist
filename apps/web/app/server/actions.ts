"use server"

import { eq } from "drizzle-orm"
import { db } from "./db"
import { report } from "./db/schema"

export async function createReport({address, city, description, userId, issue, phone}: {
  address: string,
  city: string,
  description: string,
  userId: string,
  issue: "light" | "sewage" | "water" | "sanitaion" | "crime" | "miscellaneous",
  phone: number,
}) {
  try {
    const res = await db.insert(report).values({address, city, description, userId, issue, phone})
    console.log(res)
  } catch (error) {
    console.log(error);
  }
}

export async function GetUserReports(userId: string){
  try {
    const reports = await db.select().from(report).where(eq(report.userId, userId))
    return reports;
  } catch (error) {
    console.log(error);
  }
}