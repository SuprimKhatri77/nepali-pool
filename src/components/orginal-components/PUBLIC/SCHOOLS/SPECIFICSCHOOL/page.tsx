import { eq, ne } from "drizzle-orm";
import { db } from "../../../../../../lib/db";
import { school, SchoolSelectType } from "../../../../../../lib/db/schema";
import Image from "next/image";
import SchoolCard from "../reusableComponents/SchoolCard";

export default async function SpecificSchoolDetailServer({
  Id,
}: {
  readonly Id: string;
}) {
  const schoolDetail: SchoolSelectType | undefined =
    await db.query.school.findFirst({
      where: eq(school.id, Id),
    });

  const schools: SchoolSelectType[] = await db.query.school.findMany({
    where: ne(school.id, Id),
  });

  if (!schoolDetail) return <div>No data for school</div>;
  return (
    <main>
      <section id="details" className="bg-white rounded-3xl mx-auto w-[90%]">
        <div className="my-4 mx-auto max-w-[90%] w-full flex sm:flex-row flex-col">
          <div
            id="logo"
            className="px-4 py-6 shadow-md mx-auto sm:mx-0 w-[220px] flex justify-center items-center h-[150px] mt-8"
          >
            <Image
              src={`${schoolDetail.imageUrl}`}
              alt="logo"
              width={100}
              height={100}
            />
          </div>
          <div id="text-details" className="px-4 py-6">
            <p
              className="my-3 text-base border-2 border-yellow-400 rounded-full flex items-center justify-center
             w-[200px]"
            >
              International Friendly
            </p>
            <h1 className="text-3xl font-bold">{schoolDetail.name}</h1>
            <div
              id="AECW"
              className="px-4 py-6 my-4 flex flex-wrap gap-y-4 gap-x-6"
            >
              <div
                id="address"
                className="flex gap-2 w-[500px] shadow-md items-center px-1 py-2"
              >
                <div id="icon">
                  <Image
                    src="/navigation.png"
                    alt="navigation"
                    width={30}
                    height={30}
                  />
                </div>
                <div id="text">
                  <h4 className="text-xl font-medium">Address</h4>
                  <p className="text-base font-medium">
                    {schoolDetail.address}
                  </p>
                </div>
              </div>
              <div
                id="email"
                className="flex gap-2 w-[500px] shadow-md items-center px-1 py-2"
              >
                <div id="icon">
                  <Image
                    src="/message.png"
                    alt="message"
                    width={30}
                    height={30}
                  />
                </div>
                <div id="text">
                  <h4 className="text-xl font-medium">Email</h4>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${schoolDetail.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    <p className="text-base font-medium">
                      {schoolDetail.email}
                    </p>
                  </a>
                </div>
              </div>
              <div
                id="city"
                className="flex gap-2 w-[500px] shadow-md items-center px-1 py-2"
              >
                <div id="icon">
                  <Image
                    src="/navigation.png"
                    alt="navigation"
                    width={30}
                    height={30}
                  />
                </div>
                <div id="text">
                  <h4 className="text-xl font-medium">City</h4>
                  <p className="text-base font-medium">{schoolDetail.city}</p>
                </div>
              </div>
              <div
                id="website"
                className="flex gap-2 w-[500px] shadow-md items-center px-1 py-2"
              >
                <div id="icon">
                  <Image
                    src="/navigation.png"
                    alt="navigation"
                    width={30}
                    height={30}
                  />
                </div>
                <div id="text">
                  <h4 className="text-xl font-medium">Website</h4>
                  <a
                    href={`${schoolDetail.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    <p className="text-base font-medium">
                      {schoolDetail.websiteUrl}
                    </p>
                  </a>
                </div>
              </div>
            </div>
            <div id="action-btns" className="flex gap-12">
              <button className="px-4 py-2 bg-[#be1e1e]  hover:bg-[#8a2727] transition-colors duration-300 rounded-[7px]">
                <a
                  target="_blank"
                  href={`${schoolDetail.websiteUrl}`}
                  className="text-white"
                >
                  Visit Website
                </a>
              </button>
              <button className="px-4 py-2 bg-[#be1e1e]  hover:bg-[#8a2727] transition-colors duration-300 rounded-[7px]">
                <a
                  target="_blank"
                  href={`${schoolDetail.websiteUrl}`}
                  className="text-white"
                >
                  Email
                </a>
              </button>
              <button className="px-4 py-2 bg-[#be1e1e]  hover:bg-[#8a2727] transition-colors duration-300 rounded-[7px]">
                <a
                  target="_blank"
                  href={`${schoolDetail.websiteUrl}`}
                  className="text-white"
                >
                  Google Map
                </a>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white text-black max-w-[90%] w-full px-8 shadow-md mx-auto min-h-screen pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-medium text-center py-4">
          Recommended Schools
        </h1>
        <hr className="border-2 border-yellow-400 w-12 mx-auto" />
        <div
          id="container"
          className="mt-6 flex gap-12 flex-wrap justify-center"
        >
          {/* load cards here! */}
          {schools.map((school, i) => {
            return <SchoolCard {...school} key={i + 1} />;
          })}
        </div>
      </section>
    </main>
  );
}
