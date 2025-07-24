"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import Logo from "../ui/Logo";
import Image from "next/image";
import Link from "next/link";
import { OnboardingMentor, FormState  } from "../../../server/actions/onboardingMentor";
import { toast } from "sonner";

export default function MentorOnboardingForm({currentUserId}:{readonly currentUserId:string}) {
  const initialState: FormState = {
    errors: {},
  }
  const [state,formAction, isPending]=useActionState<FormState,FormData>(OnboardingMentor,initialState)
  const [preview, setPreview] = useState("/profile.png"); // default image
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = !e.target.files ? null : e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if(state.message){
      toast(state.message)
    }
  },[state.message])
  return (
    <div id="form-container" className="shadow-2xl rounded-sm text-[#0f172a] bg-gray-200 max-w-[600px] lg:max-w-[1000px] w-full p-4 m-4">
      <Logo />
      <h1 className="text-3xl text-shadow-md font-medium my-2 text-center lg:text-left md:pl-0 lg:pl-12 ">Onboarding</h1>
      <form action={formAction} className="flex flex-col gap-8 justify-center">
        <input type="text"  defaultValue={currentUserId} className="hidden" name="userId"/>
        <div id="inputs-container" className="flex lg:flex-row flex-col-reverse gap-8 justify-center">
          <div id="left-column" className="flex flex-col gap-4">
            <div>
              <label htmlFor="country" className="font-medium text-shadow-sm text-base">
                Current Country:
              </label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="eg: Japan"
                className="shadow-xl p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200 w-full"
              />
            </div>
            <div>
              <label htmlFor="nationality" className="text-shadow-sm font-medium text-base">
                Nationality:
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                placeholder="eg: Nepali"
                className="shadow-xl p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200 w-full"
              />
            </div>
            <div id="city-zip-container" className="flex md:flex-row flex-col gap-4 w-full">
              <div id="city-container" className="flex flex-col">
                <label htmlFor="city" className="text-shadow-sm font-medium text-base">
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="eg: Kathmandu"
                  className="shadow-xl p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200"
                />
              </div>
              <div id="zip-container" className="flex flex-col">
                <label htmlFor="zip" className="text-shadow-sm font-medium text-base">
                  Zip Code:
                </label>
                <input
                  type="text"
                  name="zip"
                  id="zip"
                  placeholder="eg: 44600"
                  className="shadow-xl p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phonenumber" className="text-shadow-sm font-medium text-base">
                Phone Number
              </label>
              <input
                type="tel"
                name="phonenumber"
                id="phonenumber"
                placeholder="eg: 9800000000"
                className="shadow-xl p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200 w-full"
              />
            </div>
            <div id="gender">
              <label htmlFor="gender" className="text-shadow-sm font-medium text-base">
                Gender:
              </label>
              <div className="flex gap-2 items-center justify-center">
                <div className="flex items-center gap-2">
                  <input type="radio" name="gender" id="male" value="male" />
                  <label htmlFor="male" className="text-shadow-2xs">Male</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="gender" id="female" value="female" />
                  <label htmlFor="female" className="text-shadow-2xs">Female</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="gender" id="other" value="other" />
                  <label htmlFor="other" className="text-shadow-2xs">Other</label>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="resume" className="text-shadow-sm font-medium text-base">
                Resume:
              </label>
              <input
                type="file"
                name="resume"
                id="resume"
                className="shadow-xl border border-blue-500  p-2 w-full"
              />
            </div>
          </div>
          <div
            id="right-column"
            className="shadow-2xl rounded-sm bg-gradient-135 p-4 border-[3px] border-[#ACACAC]"
          >
            <div id="image-container" className="flex justify-center">
              <button
                id="photo-section"
                type="button"
                className="relative flex items-center justify-center focus:outline-none"
                onClick={handleProfileImageClick}
              >
                {/* Circular image container */}
                <div className="w-28 h-28 rounded-full shadow-xl overflow-hidden">
                  <Image
                    src={preview}
                    alt="profile"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* + icon overlay */}
                <div className="absolute bottom-1 right-1 bg-blue-600 cursor-pointer rounded-full w-6 h-6 flex items-center justify-center border-2 border-white text-white text-sm shadow-md">
                  +
                </div>

                <input
                  ref={fileInputRef}
                  onChange={handleProfileChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </button>
            </div>

            <div id="input-section-right">
              <div>
                <label htmlFor="citizensip" className="text-shadow-sm font-medium text-base">
                  Citizenship:
                </label>
                <input
                  type="file"
                  name="citizensip"
                  id="citizensip"
                  className="shadow-xl w-full  p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="bio" className="text-shadow-sm font-medium text-base">
                  Bio:
                </label>
                <textarea
                  id="bio"
                  maxLength={200}
                  minLength={50}
                  placeholder="Write about yourself"
                  className="shadow-xl p-2 outline-none mb-3  rounded border border-[#333446]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200 w-full max-h-[200px] min-h-[100px] h-full"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-col items-center mt-8">
          <button disabled={isPending} type="submit" className="shadow-xl bg-[#4ed7f1] hover:bg-[#46a9bd] transition duration-200 py-2 px-4 rounded w-1/2 font-medium text-base cursor-pointer">
          {isPending ? "Submitting..." : "Submit"}
          </button>
          <p className="text-shadow-md mt-4">Already have an account?&nbsp;<Link href="/login" className="font-medium hover:underline">Login</Link></p>
        </div>
      </form>
    </div>
  );
}