// app/components/HeaderWrapper.tsx
import { redirect } from "next/navigation"
import { auth } from "../../../server/lib/auth/auth"
import { headers } from "next/headers"
import Header from "./Header"
import { db } from "../../../lib/db"
import { eq } from "drizzle-orm"
import { user } from "../../../lib/db/schema";


export default async function HeaderServer() {
   const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        redirect("/login")
    }

   const [userRecord] = await db
       .select()
       .from(user)
       .where(eq(user.id, session.user.id));
   
     if (!userRecord) redirect("/sign-up");
   
     

  return <Header user={userRecord} />;
}
