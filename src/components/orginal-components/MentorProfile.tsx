import Image from "next/image";

export default function MentorProfile({ mentorProfileRecordWithUser }: any) {
  const mentor = mentorProfileRecordWithUser;
  return (
    <div className="bg-gradient-to-r  pt-4 sm:pt-8 p-0 sm:p-8">
      <div
        id="detail-container"
        className="bg-[#FBFBFB] max-w-[1200px] w-full min-h-[630px] shadow-md  mx-auto p-4 sm:p-8 rounded-md sm:rounded-3xl"
      >
        <div id="main-details" className="flex flex-col lg:flex-row gap-4">
          <div
            id="image"
            className="sm:w-68 sm:h-64 w-40 h-36 bg-gray-500 rounded-2xl mx-auto lg:mx-0"
          >
            <Image
              src="/signup.png"
              alt="signup"
              width={200}
              height={200}
              className="rounded-2xl w-full h-full"
            ></Image>
          </div>
          <div id="details" className="max-w-[800px] w-full mt-6">
            <div id="namerow" className="flex lg:justify-around ">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold lg:pl-20  text-[#1D293D]">
                {mentor.user?.name}
              </h1>
            </div>
            <div
              id="role-address"
              className="flex mt-3 text-xl sm:text-2xl lg:pl-20"
            >
              <p className=" text-[#1D293D] mt-4  font-bold">
                {mentor.user?.role.charAt(0).toUpperCase() +
                  mentor.user?.role.slice(1)}
              </p>
              <div
                id="location"
                className="flex gap-2 items-center ml-auto md:mx-auto mt-1"
              >
                <Image
                  src="/navigation.png"
                  alt="Location"
                  width={20}
                  height={20}
                  className="mt-4 sm:block hidden"
                ></Image>
                <p className=" text-[#1D293D] mt-4 text-base font-medium sm:text-2xl">
                  {mentor.city.charAt(0).toUpperCase() + mentor.city.slice(1)},{" "}
                  {mentor.country.charAt(0).toUpperCase() +
                    mentor.country.slice(1)}
                </p>
              </div>
            </div>
            <p className="text-xl sm:text-2xl text-[#1D293D] mt-4 lg:pl-20">
              Rating:
            </p>
            <div id="rating" className="flex gap-4 items-center lg:pl-20">
              <p className="text-xl sm:text-2xl text-[#1D293D]  font-bold">
                8.5
              </p>
              <div id="stars" className="flex pl-2">
                <Image
                  src="/Star.png"
                  alt="Star"
                  width={30}
                  height={30}
                  className="mt-0.5"
                ></Image>
                <Image
                  src="/Star.png"
                  alt="Star"
                  width={30}
                  height={30}
                  className="mt-0.5"
                ></Image>
                <Image
                  src="/Star.png"
                  alt="Star"
                  width={30}
                  height={30}
                  className="mt-0.5"
                ></Image>
                <Image
                  src="/Star.png"
                  alt="Star"
                  width={30}
                  height={30}
                  className="mt-0.5"
                ></Image>
                <Image
                  src="/Star.png"
                  alt="Star"
                  width={30}
                  height={30}
                  className="mt-0.5"
                ></Image>
              </div>
            </div>
          </div>
        </div>
        <div
          id="basic-information"
          className="mt-6 flex flex-col md:flex-row gap-4"
        >
          <div id="first-col" className="md:w-1/2 text-xl sm:text-2xl">
            <p className="text-[#1D293D] font-medium">Basic Information</p>
            <div className="mt-3">
              <div className="flex gap-2 text-[#1D293D]  justify-between">
                <p className="font-bold">Name:</p>
                <p className="font-medium">{mentor.user?.name}</p>
              </div>
              <div className="flex gap-2 text-[#1D293D] mt-2 justify-between">
                <p className="font-bold">Gender:</p>
                <p className="font-medium pr-26 sm:pr-32">
                  {mentor.sex.charAt(0).toUpperCase() + mentor.sex.slice(1)}
                </p>
              </div>
            </div>
            <hr className="border-2 mt-2" />
            <p className="text-xl sm:text-2xl text-[#1D293D] font-medium mt-4">
              Contact Information:
            </p>
            <div className="mt-4  sm:text-2xl text-xl">
              <div className="flex gap-2  text-[#1D293D]  justify-between">
                <p className="font-bold">Email:</p>
                <p className="font-medium text-base sm:text-2xl">
                  {mentor.user?.email}
                </p>
              </div>
              <div className="flex gap-2  text-[#1D293D] mt-2 justify-between">
                <p className="font-bold">Phone:</p>
                <p className="font-medium pr-2 text-base sm:text-2xl">
                  +977-{mentor.phoneNumber}
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div
            id="second-col"
            className="md:w-1/3 border border-[#1D293D] ml-auto mt-6 p-2 sm:p-4 font-medium text-base text-[#1D293D]"
          >
            <p className="font-bold">Bio:</p>
            <p className="mt-3">{mentor.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
