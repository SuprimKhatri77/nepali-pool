"use client";
import { useActionState, useEffect, useState } from "react";
import studentOnboarding, {
  FormState,
} from "../../../server/actions/onboardingStudent";
import Logo from "../ui/Logo";
import { toast } from "sonner";
import Link from "next/link";
import CustomProfileUploader from "./CustomImageButton";
import { useRouter } from "next/router";

export default function StudentOnboardingForm({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const initialState = {
    errors: {},
  };
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    studentOnboarding,
    initialState
  );
  const [profileImage, setProfileImage] = useState<string>("");

  const [countries, setCountries] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter();
  console.log("currentUserId", currentUserId);

  const addCountry = () => {
    const removeUnspecialChars = input.replace(/[^a-zA-Z]/g, " ").trim();
    const correctedInput =
      removeUnspecialChars.charAt(0).toUpperCase() +
      removeUnspecialChars.slice(1).toLowerCase();
    const trimmed = correctedInput.trim();
    if (trimmed && !countries.includes(trimmed)) {
      setCountries([...countries, trimmed]);
    }
    setInput("");
  };

  const removeCountry = (countryToRemove: string) => {
    setCountries(countries.filter((c) => c !== countryToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCountry();
    }
  };

  useEffect(() => {
    if (state.message && state.success) {
      toast(state.message);
      router.replace(state.redirectTo as string);
    }
    if (state.message && !state.success) {
      toast.error(state.message);
      router.replace(state.redirectTo as string);
    }
  }, [state, router]);
  return (
    <div
      id="form-container"
      className="border-blue-400 border-4 shadow-2xl rounded-sm text-[#0f172a] bg-gray-200 max-w-[600px] lg:max-w-[1000px] w-full p-4 m-4"
    >
      <Logo />
      <h1 className="text-3xl text-shadow-md font-medium my-2 text-center lg:text-left md:pl-0 pl-4">
        Onboarding
      </h1>
      <form action={formAction} className="flex flex-col gap-8 justify-center">
        <input
          type="hidden"
          value={currentUserId}
          className="hidden"
          name="userId"
        />
        <div
          id="inputs-container"
          className="flex lg:flex-row flex-col-reverse gap-8 justify-center"
        >
          <div id="left-column" className="flex flex-col gap-4">
            {/* <div>
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
            </div> */}

            <div
              id="city-district-container"
              className="flex md:flex-row flex-col justify-between gap-4 w-full"
            >
              {/* <div id="city-container" className="flex flex-col">
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
                  placeholder="eg: Butwal"
                  className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200"
                />
              </div> */}
              <div id="district-container" className="flex flex-col">
                <label
                  htmlFor="district"
                  className="text-shadow-sm font-medium text-base"
                >
                  District:
                </label>
                <input
                  type="text"
                  name="district"
                  id="district"
                  placeholder="eg: Rupandehi"
                  className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200"
                />
                {state.errors?.district && (
                  <p className="text-red-500 text-sm">
                    {state.errors.district[0]}
                  </p>
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
                type="text"
                name="phoneNumber"
                id="phonenumber"
                placeholder="eg: 9800000000"
                className="shadow-md p-2 outline-none mb-3  rounded border border-[#cecece]
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
             transition duration-200 w-full"
              />
              {state.errors?.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {state.errors?.phoneNumber[0]}
                </p>
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
                <p className="text-red-500 text-sm">{state.errors.sex[0]}</p>
              )}
            </div>
            <div id="fav-destination" className="w-full">
              <label
                htmlFor="favDestination"
                className="text-shadow-sm font-medium text-base"
              >
                Favorite Destinations:
              </label>
              <input
                type="text"
                id="favDestination"
                name="favoriteDestination"
                placeholder="Type a country and press Enter"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="shadow-md p-2 outline-none mb-3 rounded border border-[#cecece]
          focus:border-blue-500 focus:ring-2 focus:ring-blue-500 placeholder:text-[#9ca3af]
          transition duration-200 w-full"
              />
              <div className="flex flex-wrap gap-2 mt-1 mb-2">
                {countries.map((country) => (
                  <div
                    key={country}
                    className="flex items-center bg-gray-200 shadow-xl text-black px-3 py-1 rounded-full"
                  >
                    <span>{country}</span>
                    <button
                      onClick={() => removeCountry(country)}
                      className="ml-2 font-bold cursor-pointer"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {state.errors?.favoriteDestination && (
                <p className="text-red-500 text-sm">
                  {state.errors?.favoriteDestination[0]}
                </p>
              )}
            </div>
          </div>
          <div
            id="right-column"
            className="shadow-2xl rounded-sm bg-gradient-135 p-4 border-4 w-full  border-[#ACACAC]"
          >
            <div id="image-container" className="flex justify-center">
              <div
                id="photo-section"
                className="relative flex items-center justify-center flex-col focus:outline-none"
              >
                <CustomProfileUploader
                  onUploadComplete={(url: string) => setProfileImage(url)}
                  imageUploadName="Profile Image"
                  currentImage={profileImage}
                />
                <p
                  className={`text-base font-medium ${profileImage ? "hidden" : ""}`}
                >
                  Click on the image to upload
                </p>
                <input type="hidden" name="imageUrl" value={profileImage} />
              </div>
              {state.errors?.imageUrl && (
                <p className="text-red-500 text-sm">
                  {state.errors?.imageUrl[0]}
                </p>
              )}
            </div>

            <div id="input-section-right">
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
                {state.errors?.bio && (
                  <p className="text-red-500 text-sm">{state.errors?.bio[0]}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center flex-col items-center mt-8">
          <button
            disabled={isPending}
            type="submit"
            className={`
            ${isPending ? "opacity-50 cursor-not-allowed" : ""}
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
