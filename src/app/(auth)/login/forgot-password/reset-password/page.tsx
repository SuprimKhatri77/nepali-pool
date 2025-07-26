"use client";
import Logo from "@/components/ui/Logo";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams,useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "../../../../../../server/lib/auth/auth-client";


export default function ResetPassword() {
    const [isPending, setIsPending] = useState<boolean>(false)
    const [passwordObj, setPasswordObj]=useState({
        newPassword: "",
        confirmNewPassword: "",
    })
    const router=useRouter()
    const token = useSearchParams().get("token")
    if(!token) {
        return (
            <div>Not authorized</div>
        )
    }

 const handleResetPassword = async () =>{
    setIsPending(true)
    if(passwordObj.newPassword === passwordObj.confirmNewPassword) {
        const {  error } = await authClient.resetPassword({
            newPassword: passwordObj.newPassword,
            token: token,
        })
        if(error) {
            toast.error(error.message)
        }
        toast.success("Password changed successfully, redirecting to login.....")
        setTimeout(() => {
            router.push("/login")
        }, 1500);
    }

    setIsPending(false)
 }

    return (
      <div className="flex flex-col items-center justify-center ">
      <div className="rounded-xl message-container bg-white item  p-8 max-w-[500px]">
        <Logo />
      
          <Image
            className="m-auto mt-3"
            src="/reset.png"
            alt="reset"
            width={50}
            height={50}
          />

        <form action="" className="max-w-[650px] w-full">
          <h1 className="text-3xl px-8 font-medium text-[#4C585B] my-4 text-left ">
            Resetting Password
          </h1>
          <div className="px-8 flex flex-col">
            <div className="flex flex-col gap-1 w-full max-w-[500px] mt-2">
                <label htmlFor="newPassword">New Password</label>

              <input
                value={passwordObj.newPassword}
                onChange={(e) => setPasswordObj({...passwordObj, newPassword: e.target.value})}
                id="newPassword"
                autoComplete="off"
                type="password"
                name="newPassword"
                className="max-w-[440px] w-full p-2 outline-none mb-2  rounded-sm border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200
            "
                placeholder="eg: UfD9A@example.com"
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full max-w-[500px] mt-2">
                <label htmlFor="confirmNewPassword"> Confirm Password</label>
              <input
                value={passwordObj.confirmNewPassword}
                onChange={(e) => setPasswordObj({...passwordObj, confirmNewPassword: e.target.value})}

                id="confirmNewPassword"
                autoComplete="off"
                type="password"
                name="confirmNewPassword"
                className="max-w-[440px] w-full p-2 outline-none mb-2  rounded-sm border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200
            "
                placeholder="eg: UfD9A@example.com"
                required
              />
            </div>
              {passwordObj.newPassword !== passwordObj.confirmNewPassword && <p className="text-red-500">Passwords do not match</p>}
              
            <p className="text-[#1F406B] my-3">Create a strong password to secure your account!</p>
          </div>

          <div className="px-4 flex justify-center ">
            <button
              type="button"
              onClick={handleResetPassword}
              className={`rounded-xs w-[90%] mt-2 bg-[#4ED7F1] hover:scale-105  py-2 px-4 font-bold cursor-pointer duration-500 
              ${
                isPending
                  ? "bg-[#4ED7F1] cursor-not-allowed opacity-65"
                  : "bg-[#4ED7F1] hover:bg-[#4ED7F1] hover:scale-105"
              }
              `}
            >
              {isPending ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        </form>
        <p className="p-4 text-center mt-1 ">
          Remember password?{" "}
          <Link href="/login" className="hover:underline text-blue-700">
            Login
          </Link>{" "}
        </p>
      </div>
    </div>
    );
}