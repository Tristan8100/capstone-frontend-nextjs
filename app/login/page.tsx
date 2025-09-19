import Login from "@/components/auth/login";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export default function LoginPage() {
  return (
    <>
      <Login/>
      <PWAInstallPrompt/>
    </>
  );
}