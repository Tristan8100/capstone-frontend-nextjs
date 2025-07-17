'use client'


import AlumniIDCard from "@/components/alumni-id";
import { useAuth } from "@/contexts/AuthContext";


export default function Page() {

  const { user } = useAuth();

  const alumniData = {
    alumniName: user.name,
    studentId: user.id,
    institutionName: "",
    graduationYear: "2018",
    profilePictureUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    qrCodeUrl: 'http://localhost:8000/' + user.qr_code_path,
  };
  return (
    <>
      <h2 className="text-xl font-semibold">Latest Post</h2>
      <AlumniIDCard {...alumniData} />
    </>
  )
}