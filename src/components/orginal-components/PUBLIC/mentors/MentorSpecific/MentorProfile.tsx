import Image from "next/image";
import { MentorProfileType } from "./MentorSpecific";

export default function MentorProfile({
  mentorDetail,
}: Readonly<{ mentorDetail: MentorProfileType }>) {
  console.log(mentorDetail);
  return (
    <section className="md:mx-auto md:max-w-[90%] w-full">
      <div
        id="detail-container"
        className="bg-[linear-gradient(60deg,#DD4251_44%,#760000_100%)] max-w-[1200px] w-full min-h-[630px] shadow-md  mx-auto p-4 sm:p-8 rounded-md sm:rounded-3xl text-white"
      >
        <div id="main-details" className="flex flex-col lg:flex-row gap-4">
          <div
            id="image"
            className="sm:w-68 sm:h-64 w-40 h-36 rounded-2xl mx-auto lg:mx-0"
          >
            <Image
              src={mentorDetail.mentorDetail.imageUrl}
              alt="signup"
              width={200}
              height={200}
              className="rounded-full w-full h-full max-h-[200px] max-w-[200px]"
            ></Image>
          </div>
          <div id="details" className="max-w-[800px] w-full mt-6">
            <div id="namerow" className="flex justify-between">
              <h1 className="text-xl sm:text-3xl md:text-5xl font-bold lg:pl-20">
                {mentorDetail.user.name}
              </h1>
              <button className="bg-[#12B02A] px-4 py-2 rounded-md cursor-pointer hover:bg-[#109524] transition-colors duration-200">
                Make A Call
              </button>
            </div>
            <div
              id="role-address"
              className="flex mt-3 text-xl sm:text-2xl lg:pl-20"
            >
              <div id="location" className="flex gap-2 items-center  mt-1">
                <Image
                  src="/navigation.png"
                  alt="Location"
                  width={20}
                  height={20}
                  className="mt-4 sm:block hidden"
                ></Image>
                <p className=" text-[#D2D2D2] mt-4 text-base font-medium sm:text-2xl">
                  {mentorDetail.mentorDetail.city
                    ?.charAt(0)
                    .toUpperCase()
                  // mentorDetail.mentorDetail.city.slice(1)
                  }
                  ,{" "}
                  {mentorDetail.mentorDetail.country
                    ?.charAt(0)
                    .toUpperCase()
                  // mentorDetail.mentorDetail.country.slice(1)
                  }
                </p>
              </div>
              <span className="flex gap-2 items-center text-base cursor-pointer mt-2 ml-auto">
                <Image
                  src="/Bookmark.png"
                  alt="Bookmark"
                  width={20}
                  height={20}
                  className=""
                ></Image>
                Add to favourites
              </span>
            </div>
            <p className="text-xl sm:text-2xl text-[#D2D2D2] mt-4 lg:pl-20">
              Rating:
            </p>
            <div id="rating" className="flex gap-4 items-center lg:pl-20">
              <p className="text-xl sm:text-2xl  font-bold">8.5</p>
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
            <p className="text-[#D2D2D2] font-medium">Mentorship Record</p>
            {/* todo : add mentorship record */}
            <div className="mt-3">
              <div className="flex gap-2   justify-between">
                <p className="font-bold">Calls:</p>
                <p className="font-medium">10</p>
              </div>
              <div className="flex gap-2  mt-2 justify-between">
                <p className="font-bold">Requests:</p>
                <p className="font-medium">40+</p>
              </div>
            </div>
            <hr className="border-2 mt-2" />
            <p className="text-xl sm:text-xl text-[#D2D2D2] font-medium mt-4">
              Specialization:
            </p>
            {/* todo : add specialization */}
            <div className="mt-4  sm:text-2xl text-xl">
              <div className="flex gap-2   justify-between">
                <p className="font-bold">Fields:</p>
                <p className="font-medium text-base sm:text-xl">
                  Computer Science
                </p>
              </div>
              <div className="flex gap-2  mt-2 justify-between">
                <p className="font-bold">Institution:</p>
                <p className="font-medium pr-2 text-base sm:text-xl text-right">
                  Kyoto Language School
                </p>
              </div>
              <div className="flex gap-2  mt-2 justify-between">
                <p className="font-bold">Working:</p>
                <p className="font-medium pr-2 text-base sm:text-2xl">Yes</p>
              </div>
            </div>
          </div>
          <hr />
          <div
            id="second-col"
            className="md:w-1/3 border border-white ml-auto mt-6 p-2 sm:p-4 font-medium text-base"
          >
            <p className="font-bold">Bio:</p>
            <p className="mt-3">{mentorDetail.mentorDetail.bio}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
