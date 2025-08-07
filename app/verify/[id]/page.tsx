'use client';

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function VerificationPage() {
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    api.get(`/api/profile/user/${id}`)
      .then(response => {
        setVerificationData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setVerificationData(null);
        setError(error.message);
        setLoading(false);
      })
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <h1 className="text-2xl font-bold">Verifying credentials</h1>
        <p className="text-muted-foreground">Please wait while we verify this ID</p>
      </div>
    );
  }

  if (error || !verificationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
        <div className="p-4 rounded-full bg-destructive/10">
          <XCircle className="w-16 h-16 text-destructive" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Verification Failed</h1>
          <p className="text-lg text-muted-foreground">
            No registered alumni found with ID: {id}
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Scan Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
      <div className="p-4 rounded-full bg-primary/10">
        <CheckCircle2 className="w-16 h-16 text-primary" strokeWidth={1.5} />
      </div>
      
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Verification Successful</h1>
        <p className="text-lg text-muted-foreground">
          Alumni credentials verified
        </p>
      </div>

      <div className="w-full max-w-md p-6 space-y-4 text-left bg-muted/50 rounded-lg">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium">{verificationData.name || "Not provided"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ID Number</span>
          <span className="font-mono font-medium">{id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Batch</span>
          <span className="font-medium">{verificationData.batch || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Course</span>
          <span className="font-medium">{verificationData.course || "N/A"}</span>
        </div>
      </div>

      <Button onClick={() => window.location.reload()}>
        Verify Another ID
      </Button>
    </div>
  );
}