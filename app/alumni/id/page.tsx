
import AlumniIDCard from "@/components/alumni-id";



export default function Page() {
  const alumniData = {
    alumniName: "Maria Clara Reyes",
    studentId: 23234324,
    institutionName: "University of the Philippines Los Baños",
    graduationYear: "2018",
    profilePictureUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    qrCodeUrl: "/static/3135823.png",
  };
  return (
    <>
      <h2 className="text-xl font-semibold">Latest Post</h2>
      <AlumniIDCard {...alumniData} />
    </>
  )
}