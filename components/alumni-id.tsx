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
    // Responsive card container with background image
    <Card className="
      w-full max-w-[600px] min-h-[400px] md:h-[400px]
      relative
      shadow-2xl hover:shadow-3xl transition-shadow duration-300
      rounded-2xl overflow-hidden
      flex flex-col
      bg-white
      border-2 border-gray-200
      group
    ">
      <div className="absolute inset-0 z-0">
        <Image
          src="/static/alumni.jpg" // placeholder image
          alt="Background"
          fill
          className="object-cover blur-sm opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      </div>
      
      <CardHeader className="bg-gradient-to-r from-blue-800 to-purple-900 text-white p-4 md:p-5 flex flex-row items-center justify-between border-b border-blue-600/30 relative z-10">
        <div className="flex items-center">
          {/* Institution Logo */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center mr-3 md:mr-4 overflow-hidden shadow-md">
            <Image
              src="/static/TSBA Logo.png" // <---- Update this path!
              alt="Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-sm md:text-xl font-bold tracking-wide leading-tight">Baliuag Polytechnic College</h1>
            <CardTitle className="text-xs md:text-base font-light leading-none opacity-80 mt-1">OFFICIAL ALUMNI ID CARD</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row md:space-x-4 p-4 md:p-6 bg-white/60 flex-grow relative z-10">
        {/* Profile Section */}
        <div className="flex flex-col md:flex-none items-center justify-center w-full md:w-[160px] mb-4 md:mb-0">
          <Avatar className="w-24 h-24 md:w-36 md:h-36 border-4 md:border-6 border-white rounded-full shadow-md">
            {profilePictureUrl ? (
              <AvatarImage src={profilePictureUrl} alt={alumniName} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-800">
                  {alumniName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </Avatar>
 
          <div className="md:hidden mt-3 text-center">
            <p className="text-lg font-extrabold text-gray-900 leading-tight">{alumniName}</p>
            <p className="text-sm text-gray-700 mt-1">ID: <span className="font-bold text-gray-800">{studentId}</span></p>
            {graduationYear && (
              <p className="text-sm text-gray-600 mt-1">Grad: <span className="font-semibold text-gray-700">{graduationYear}</span></p>
            )}
          </div>
        </div>

        {/* Main info */}
        <div className="hidden md:flex flex-grow flex-col justify-center text-left space-y-3">
          <p className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight">{alumniName}</p>
          <p className="text-md text-gray-700">Student ID: <span className="font-bold text-gray-800 tracking-tight">{studentId}</span></p>
          {graduationYear && (
            <p className="text-md text-gray-600">Graduation Year: <span className="font-semibold text-gray-700">{graduationYear}</span></p>
          )}
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center w-full md:w-[160px] mt-4 md:mt-0">
          {qrCodeUrl ? (
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={144}
              height={144}
              className="w-28 h-28 md:w-36 md:h-36 object-contain border border-gray-300/50 p-1 rounded-lg shadow-sm bg-white"
            />
          ) : (
            <div className="w-28 h-28 md:w-36 md:h-36 bg-gray-100 flex flex-col items-center justify-center text-gray-500 text-sm text-center border-2 border-dashed border-gray-400 rounded-lg p-2 bg-white/90">
              <span className="mb-2 text-base font-medium">QR Code</span>
              <span>Scan to Verify ID</span>
            </div>
          )}
          
          {/* Mobile-only thing */}
          <div className="md:hidden mt-3 text-center text-xs text-gray-500">
            Scan QR code to verify alumni status
          </div>
        </div>
      </CardContent>

      {/* for copyright */}
      <div className="bg-gray-100/90 p-3 md:p-4 text-xs text-gray-600 text-center border-t border-gray-200 font-medium relative z-10">
        <p>&copy; {new Date().getFullYear()} Baliuag Polytechnic College. All Rights Reserved.</p>
      </div>
    </Card>
  );
};

export default AlumniIDCard;