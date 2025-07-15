import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

// Define the props interface for type safety
interface AlumniIDCardProps {
  alumniName: string;
  studentId: number;
  institutionName: string;
  graduationYear?: string;
  profilePictureUrl?: string;
  qrCodeUrl?: string;
}

const AlumniIDCard: React.FC<AlumniIDCardProps> = ({
  alumniName,
  studentId,
  graduationYear,
  profilePictureUrl,
  qrCodeUrl,
}) => {
  return (
    // Card container: Increased width and height for more spacious layout
    <Card className="
      w-[600px] h-[400px]
      relative
      shadow-2xl hover:shadow-3xl transition-shadow duration-300
      rounded-2xl overflow-hidden
      flex flex-col
      bg-white
      border-2 border-gray-200
      group
    ">
      <CardHeader className="bg-gradient-to-r from-blue-800 to-purple-900 text-white p-5 flex flex-row items-center justify-between border-b border-blue-600/30">
        <div className="flex items-center">
          {/* Institution Logo */}
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 overflow-hidden shadow-md">
            {/* IMPORTANT: Replace with your actual logo path */}
            <Image
              src="/static/TSBA Logo.png" // <---- Update this path!
              alt="Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {/* Institution Name and Alumni ID Title */}
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-wide leading-tight">Baliuag Polytechnic College</h1>
            <CardTitle className="text-base font-light leading-none opacity-80 mt-1">OFFICIAL ALUMNI ID CARD</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex space-x-2 bg-gray-50">
        {/* Left Section: Profile Picture */}
        <div className="flex-none flex items-center justify-center w-[160px]">
          <Avatar className="w-36 h-36 border-6 rounded-full">
            {profilePictureUrl && (
              <AvatarImage src={profilePictureUrl} alt={alumniName} />
            )}
          </Avatar>
        </div>

        {/* Middle Section: Name, Student ID, and Graduation Year */}
        <div className="flex-grow flex flex-col justify-center text-left space-y-3">
          <p className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">{alumniName}</p>
          <p className="text-md text-gray-700">Student ID: <span className="font-bold text-gray-800 tracking-tight">{studentId}</span></p>
          {graduationYear && (
            <p className="text-md text-gray-600">Graduation Year: <span className="font-semibold text-gray-700">{graduationYear}</span></p>
          )}
        </div>

        {/* Right Section: QR Code */}
        <div className="flex-none flex items-center justify-center w-[160px]">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={144}
              height={144}
              className="w-36 h-36 object-contain border border-gray-300/50 p-1 rounded-lg shadow-sm"
            />
          ) : (
            <div className="w-36 h-36 bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-sm text-center border-2 border-dashed border-gray-400 rounded-lg p-2">
              <span className="mb-2 text-base font-medium">QR Code</span>
              <span>Scan to Verify ID</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer Area with Institution Name (for copyright) */}
      <div className="bg-gray-100 p-4 text-xs text-gray-600 text-center border-t border-gray-200 font-medium">
        <p>&copy; {new Date().getFullYear()} Baliuag Polytechnic College. All Rights Reserved.</p>
      </div>
    </Card>
  );
};

export default AlumniIDCard;