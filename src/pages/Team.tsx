import { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import FacultyPeople from "@/components/home/FacultyPeople";
import Faculties from "@/components/home/Faculties";
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
      <div className="bg-[#F7F6F3] dark:bg-black">
        <FacultyPeople faculty={faculty} />
        <Faculties />
      </div>
    </MainLayout>
  );
};

export default Team;
