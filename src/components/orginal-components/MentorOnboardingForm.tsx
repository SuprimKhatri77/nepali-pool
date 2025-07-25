"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import Logo from "../ui/Logo";
import Image from "next/image";
import Link from "next/link";
import {
  OnboardingMentor,
  FormState,
} from "../../../server/actions/onboardingMentor";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { useRouter } from "next/navigation";
export default function MentorOnboardingForm({}: // currentUserId,
{
  readonly currentUserId: string;
}) {
  const initialState: FormState = {
    errors: {},
  };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    OnboardingMentor,
    initialState
  );
  const { startUpload } = useUploadThing("imageUploader");
  const router = useRouter();

  const [profileImage, setProfileImage] = useState("/profile.png");
  const [citizenshipImage, setcitizenshipImage] = useState("/images.jpg");
  const [resumeImage, setResumeImage] = useState("/sample.jpg");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = !e.target.files ? null : e.target.files[0];
    const field = e.target.name;

    if (!file) {
      if (field === "citizenshipPhotoUrl") {
        setcitizenshipImage("/signup.png");
      } else if (field === "resume") {
        setResumeImage("/signin.png");
      } else {
        setProfileImage("/profile.png");
      }
      return;
    }

    const localPreviewURL = URL.createObjectURL(file);

    if (field === "imageUrl") {
      setProfileImage(localPreviewURL);
    } else if (field === "citizenshipPhotoUrl") {
      setcitizenshipImage(localPreviewURL);
    } else if (field === "resume") {
      setResumeImage(localPreviewURL);
    }
    if (file) {
      const uploaded = await startUpload([file]);
      if (uploaded?.[0]?.ufsUrl) {
        const hostedURL = uploaded[0].ufsUrl;
        if (hostedURL) {
          if (field === "imageUrl") {
            setProfileImage(hostedURL);
          }
          if (field === "citizenshipPhotoUrl") {
            setcitizenshipImage(hostedURL);
          }
          if (field === "resume") {
            setResumeImage(hostedURL);
          }
        }
      }
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    console.log("profileImage", profileImage);
    console.log("citizenshipImage", citizenshipImage);
    console.log("resumeImage", resumeImage);
  }, [profileImage, citizenshipImage, resumeImage]);

  useEffect(() => {
    if (state.redirectTo) {
      router.replace(state.redirectTo);
    }
    if (state.message) {
      toast(state.message);
    }
    if (state.errors) {
      console.log(state.errors.zipcode?.[0]);
    }
  }, [router, state.redirectTo, state.message, state.errors]);
  return (
    <div
      id="form-container"
      className="border-blue-400 border-4 shadow-2xl rounded-sm text-[#0f172a] bg-gray-200 max-w-[600px] lg:max-w-[1000px] w-full p-4 m-4"
    >
      <Logo />
      <h1 className="text-3xl text-shadow-md font-medium my-2 text-center lg:text-left md:pl-0 lg:pl-9 ">
        Onboarding
      </h1>
      <form action={formAction} className="flex flex-col gap-8 justify-center">
        <input
          type="text"
          // defaultValue={currentUserId}
          className="hidden"
          name="userId"
        />
        <div
          id="inputs-container"
          className="flex lg:flex-row flex-col-reverse gap-8 justify-center"
        >
          <div id="left-column" className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="country"
                className="font-medium text-shadow-sm text-base"
              >
                Current Country:
              </label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="eg: Japan"
                className="shadow-sm p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200 w-full"
              />
              {state.errors?.country && (
                <span className="text-red-500">{state.errors.country[0]}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="nationality"
                className="text-shadow-sm font-medium text-base"
              >
                Nationality:
              </label>
              <input
                type="text"
                name="nationality"
                id="nationality"
                placeholder="eg: Nepali"
                className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200 w-full"
              />
              {state.errors?.nationality && (
                <span className="text-red-500">
                  {state.errors.nationality[0]}
                </span>
              )}
            </div>
            <div
              id="city-zip-container"
              className="flex md:flex-row flex-col justify-between gap-4 w-full"
            >
              <div id="city-container" className="flex flex-col">
                <label
                  htmlFor="city"
                  className="text-shadow-sm font-medium text-base"
                >
                  City:
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  placeholder="eg: Kathmandu"
                  className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200"
                />
                {state.errors?.city && (
                  <span className="text-red-500">{state.errors.city[0]}</span>
                )}
              </div>
              <div id="zip-container" className="flex flex-col">
                <label
                  htmlFor="zip"
                  className="text-shadow-sm font-medium text-base"
                >
                  Zip Code:
                </label>
                <input
                  type="text"
                  name="zipcode"
                  id="zip"
                  placeholder="eg: 44600"
                  className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200"
                />
                {state.errors?.zipcode && (
                  <span className="text-red-500">
                    {state.errors.zipcode[0]}
                  </span>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="phonenumber"
                className="text-shadow-sm font-medium text-base"
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phonenumber"
                placeholder="eg: 9800000000"
                className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200 w-full"
              />
              {state.errors?.phoneNumber && (
                <span className="text-red-500">
                  {state.errors.phoneNumber[0]}
                </span>
              )}
            </div>
            <div id="gender">
              <label
                htmlFor="gender"
                className="text-shadow-sm font-medium text-base"
              >
                Gender:
              </label>
              <div className="flex gap-2 items-center justify-center">
                <div className="flex items-center gap-2">
                  <input type="radio" name="sex" id="male" value="male" />
                  <label htmlFor="male" className="text-shadow-2xs">
                    Male
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="sex" id="female" value="female" />
                  <label htmlFor="female" className="text-shadow-2xs">
                    Female
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="sex" id="other" value="other" />
                  <label htmlFor="other" className="text-shadow-2xs">
                    Other
                  </label>
                </div>
              </div>
              {state.errors?.sex && (
                <span className="text-red-500">{state.errors.sex[0]}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="resume"
                className="text-shadow-sm font-medium text-base"
              >
                Resume:
              </label>
              <input
                onChange={handleImageChange}
                type="file"
                name="resume"
                id="resume"
                className="shadow-md border border-blue-500  p-2 w-full"
              />
            </div>
            <div className="w-100 h-auto shadow-md rounded-sm overflow-hidden mx-auto">
              <Image
                unoptimized
                src={resumeImage}
                alt="profile"
                width={208}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <div
            id="right-column"
            className="shadow-2xl rounded-sm bg-gradient-135 p-4 border-4 lg:max-h-[620px] border-[#ACACAC]"
          >
            <div id="image-container" className="flex justify-center">
              <button
                id="photo-section"
                type="button"
                className="relative flex items-center justify-center focus:outline-none"
                onClick={handleProfileImageClick}
              >
                {/* Circular image container */}
                <div className="w-28 h-28 rounded-full shadow-md overflow-hidden">
                  <Image
                    unoptimized
                    src={profileImage}
                    alt="profile"
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                  />
                </div>
                 {/* + button */}
                <div className="absolute bottom-1 right-1 bg-blue-600 cursor-pointer rounded-full w-6 h-6 flex items-center justify-center border-2 border-white text-white text-sm shadow-md">
                  +
                </div>

                <input
                  name="imageUrl"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </button>
            </div>

            <div id="input-section-right">
              <div>
                <label
                  htmlFor="citizenship"
                  className="text-shadow-sm font-medium text-base"
                >
                  Citizenship:
                </label>
                <input
                  name="citizenshipPhotoUrl"
                  onChange={handleImageChange}
                  type="file"
                  id="citizensip"
                  className="shadow-md w-full  p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#1F406B]
             transition duration-200"
                />

                <div className="w-100 h-65 shadow-md rounded-sm overflow-hidden mx-auto">
                  <Image
                    unoptimized
                    src={citizenshipImage}
                    alt="Citizenship card"
                    width={208}
                    height={208}
                    className="object-fit w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="bio"
                  className="text-shadow-sm font-medium text-base"
                >
                  Bio:
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  maxLength={200}
                  minLength={50}
                  placeholder="Write about yourself"
                  className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#6b717a]
             transition duration-200 w-full max-h-[200px] min-h-[100px] h-full"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-col items-center mt-8">
          <button
            disabled={isPending}
            type="submit"
            className={`
            ${
              isPending 
                ||
              !profileImage.startsWith("https://vbteadl6m3.ufs.sh/f/") ||
              !citizenshipImage.startsWith("https://vbteadl6m3.ufs.sh/f/") ||
              !resumeImage.startsWith("https://vbteadl6m3.ufs.sh/f/") 
               
                ? "opacity-50 cursor-not-allowed"
                : ""
            } 
            shadow-md bg-[#4ed7f1] hover:scale-105 transition duration-200 py-2 px-4 rounded w-1/2 font-medium text-base cursor-pointer`}
          >
            {isPending ? "Submitting..." : "Submit"}
          </button>
          <p className="text-shadow-md mt-4">
            Already have an account?&nbsp;
            <Link
              href="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
