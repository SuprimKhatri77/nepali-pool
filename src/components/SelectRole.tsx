"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { FormState, UpdateUserRole } from "../../server/actions/updateRole"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export default function SelectRolePage() {
    const initialState: FormState = {
        errors: {}
    }
    const [state, formAction, isPending] = useActionState<FormState, FormData>(UpdateUserRole, initialState)
    const [role, setRole] = useState("")
    const router = useRouter()

    useEffect(() => {
        let timeout: any;
        if (state.success) {
            timeout = setTimeout(() => {

                toast(state.message)
            }, 1200)

            timeout = setTimeout(() => {
                router.replace(state.redirectTo as string)
            }, 2000);
        }

        return () => clearTimeout(timeout)
    }, [state.message, state.success])

    return (
        <form action={formAction} className="flex flex-col gap-3 min-h-screen items-center justify-center">
            <h1 className="text-xl font-bold">Looks like you missed out to select the role on sign-up??</h1>
            <p className="italic font-medium">No worreis though we have got you covered , You can do it now!</p>
            <div className="space-y-2 flex gap-2 items-center">
                <Label
                    htmlFor="role"
                    className="text-title text-sm">
                    Role
                </Label>
                <Select onValueChange={(value) => setRole(value)} value={role}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent id='role'>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                    </SelectContent>
                </Select>
                {state.errors?.role && (
                    <p className="text-sm text-red-400">{state.errors.role[0]}</p>
                )}
                <input type="hidden" name="role" value={role} required />

            </div>
            <Button type="submit" disabled={isPending}>
                {isPending ? "Updating...." : "Confirm"}
            </Button>
        </form>
    )
}


