
import AlumniIDCard from "@/components/alumni-id";
import AlumniLayout from "@/components/layout/alumni-layout"



export default function Page() {
  const alumniData = {
    alumniName: "Maria Clara Reyes",
    studentId: "UPLB-2018-54321",
    institutionName: "University of the Philippines Los Baños",
    graduationYear: "2018",
    profilePictureUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=UPLB-MARIA-CLARA-2018"
  };
  return (
    <AlumniLayout currentPage="Community Feed">
      <h2 className="text-xl font-semibold">Latest Post</h2>
      <AlumniIDCard {...alumniData} />
    </AlumniLayout>
  )
}