import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import FacultyPeople from "@/components/home/FacultyPeople";
import { facultyApi, type Faculty } from "@/api/faculty";

const Team = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);

  useEffect(() => {
    let active = true;
    facultyApi.getAll().then((data) => {
      if (active) setFaculty(data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <MainLayout>
      <div className="pt-8 bg-gradient-to-br from-black via-gray-900 to-black min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Our <span className="text-yellow-400">Team</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Meet the people building the Academy.
          </p>
        </div>
      </div>
      <div className="bg-[#F7F6F3]">
        <FacultyPeople faculty={faculty} />
      </div>
    </MainLayout>
  );
};

export default Team;
