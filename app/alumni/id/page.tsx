'use client'


import AlumniIDCard from "@/components/alumni-id";
import { useAuth } from "@/contexts/AuthContext";


export default function Page() {

  const { user } = useAuth();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const alumniData = {
    alumniName: user.name,
    studentId: user.id,
    institutionName: "",
    graduationYear: "2018",
    profilePictureUrl: user.profile_path,
    qrCodeUrl: user.qr_code_path,
  };
  return (
    <>
      <AlumniIDCard {...alumniData} />
    </>
  )
}