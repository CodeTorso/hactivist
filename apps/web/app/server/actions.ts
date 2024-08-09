"use server"

import { desc, eq } from "drizzle-orm"
import { db } from "./db"
import { imageLink, report, adminKey, users } from "./db/schema"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"
export async function createReport({address, city, description, userId, issue, phone, image, userImage}: {
  address: string,
  city: string,
  description: string,
  userId: string,
  issue: "light" | "sewage" | 'water' | 'sanitaion' | 'crime' | 'miscellaneous',
  phone: number,
  image: string[],
  userImage: string
}) {
  try {
    const res = await db.insert(report).values({address, city, description, userId, phone, issue, image: userImage }).returning({id: report.id});
    const {id} = res[0] as {id: number}
    
    await Promise.all(image.map((v) => 
      db.insert(imageLink).values({imageUrl: v, reportId: id})
    ));

    console.log(res);
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  } 
  revalidatePath("/dashboard/user");
}

export async function GetUserReports(userId: string) {
  try {
    const reports = await db.select().from(report).where(eq(report.userId, userId)).orderBy(desc(report.created));
    
    const reportsWithImages = await Promise.all(reports.map(async (report) => {
      const images = await db.select().from(imageLink).where(eq(imageLink.reportId, report.id));
      return {
        ...report,
        images: images.map(img => img.imageUrl)
      };
    }));

    return reportsWithImages;
  } catch (error) {
    console.error("Error fetching user reports:", error);
    throw error;
  }
}

export async function serveAdmin({key, userId}: {key:string, userId: string}){
  const resp = await db.query.adminKey.findFirst({with: {key:key}});
  if (!resp) {
    return {message: "admin key does not exist."};
  }
  try {
    await db.update(adminKey).set({status: "used"}).where(eq(adminKey.key, key))
    await db.update(users).set({role: "admin"}).where(eq(users.id, userId))
  } catch (error) {
    console.log(error);
    return {message: "Error updating user role."};
  }

  redirect("/dashboard/admin")
}