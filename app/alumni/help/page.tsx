'use client';
import { useEffect, useState } from 'react';
import { api2 } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Admin {
  id: number;
  name: string;
  email: string;
  profile_path?: string | null;
}

export default function AdminList() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api2.get<Admin[]>('/api/get-admins');
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const handleStartConversation = async (adminId: number) => {
    try {
      const response = await api2.post<any>('/api/conversations', { admin_id: adminId });
      router.push(`/alumni/chat/${response.data.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Available Admins</h1>
      
      <div className="space-y-4">
        {admins.map((admin) => (
          <Card key={admin.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage 
                    src={admin.profile_path || '/default-avatar.png'} 
                    alt={admin.name}
                  />
                  <AvatarFallback>
                    {admin.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">{admin.name}</h3>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </div>
              </div>

              <Button 
                onClick={() => handleStartConversation(admin.id)}
                className="ml-auto"
              >
                Message
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}