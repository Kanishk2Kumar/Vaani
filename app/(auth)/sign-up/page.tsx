import { SignInUserForm } from "@/components/authForms/sign-User";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Image src="/icons/logo.png" alt="Logo" width={140} height={55} />
        </div>
        <SignInUserForm />
      </div>
    </div>
  );
}
