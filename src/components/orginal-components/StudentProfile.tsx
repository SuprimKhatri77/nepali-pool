import Image from "next/image";

export default function StudentProfile() {
  return (
    <div className="bg-gradient-to-r from-[#BEDFFF] via-[#D1E9FF] to-white from-0% via-50% to-100% min-h-screen py-5 px-2 sm:p-8">
        <div id="detail-container" className="bg-[#FBFBFB] max-w-[1200px] w-full min-h-[630px] shadow-md  mx-auto p-4 sm:p-8 rounded-xl sm:rounded-3xl">
           <div id="main-details" className="flex flex-col lg:flex-row gap-4">
               <div id="image" className="sm:w-68 sm:h-64 w-40 h-36 bg-gray-500 rounded-2xl mx-auto lg:mx-0">
                   <Image src='/signup.png' alt="signup" width={200} height={200} className="rounded-2xl w-full h-full"></Image>
               </div>
               <div id="details" className="max-w-[800px] w-full mt-6">
                   <div id="namerow" className="flex">
                      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold lg:pl-20 text-[#1D293D] text-left">Roshan Pokharel</h1>
                   </div>
                   <div id="role-address" className="flex mt-3 text-xl sm:text-2xl lg:pl-20">
                       <p className=" text-[#1D293D] mt-4  font-bold">Student</p>
                       <div id="location" className="flex gap-2 items-center mx-auto mt-1">
                        <Image src="/navigation.png" alt="Location" width={20} height={20} className="mt-4"></Image>
                        <p className=" text-[#1D293D] mt-4">Kathmandu, Nepal</p>
                       </div>
                   </div>
               </div>
               
           </div>
           <div id="basic-information" className="mt-6 flex flex-col md:flex-row gap-4">
              <div id="first-col" className="md:w-1/2 text-xl sm:text-2xl">
                  <p className="text-[#1D293D] font-medium">Basic Information</p>
                  <div className="mt-3">
                     <div className="flex gap-2 text-[#1D293D]  justify-between">
                        <p className="font-bold">Name:</p>
                        <p className="font-medium">Roshan Pokharel</p>
                     </div>
                     <div className="flex gap-2 text-[#1D293D] mt-2 justify-between">
                        <p className="font-bold">Gender:</p>
                        <p className="font-medium pr-26 sm:pr-32">Male</p>
                     </div>
                  </div>
                  <hr className="border-2 mt-2"/>
                  <p className="text-xl sm:text-2xl text-[#1D293D] font-medium mt-4">
                    Contact Information:
                  </p>
                  <div className="mt-4  sm:text-2xl text-xl">
                     <div className="flex gap-2  text-[#1D293D]  justify-between">
                        <p className="font-bold">Email:</p>
                        <p className="font-medium ">email@gmail.com</p>
                     </div>
                     <div className="flex gap-2  text-[#1D293D] mt-2 justify-between">
                        <p className="font-bold">Phone:</p>
                        <p className="font-medium pr-2">+977-9812345678</p>
                     </div>
                  </div>
              </div>
              <hr />
              <div id="second-col" className="md:w-1/3 border border-[#1D293D] ml-auto mt-6 p-2 sm:p-4 font-medium text-base text-[#1D293D]">
                 <p className="font-bold">Bio:</p>
                 <p className="mt-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique, porro iusto? Tempora magni corrupti pariatur! Corporis eum accusamus, ut numquam libero nobis enim temporibus, consequatur cum odio ducimus neque animi.</p>
              </div>
           </div>
        </div>
    </div>
  )
}
