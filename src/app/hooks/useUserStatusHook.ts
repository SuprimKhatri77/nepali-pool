import { headers } from "next/headers"
import { auth } from "../../../server/lib/auth/auth"
import { redirect } from "next/navigation"

export const useStatusHook = async (): Promise<boolean> => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        redirect("/login")
    }
    return true
}