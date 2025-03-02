import { redirect } from "next/navigation";
import { auth } from "@/auth"; // Ensure you have this file configured
import prisma from "@/lib/prisma";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  // Retrieve the current session
  const session = await auth();
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Fetch the user details from the database along with their organization
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { organization: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <ProfileForm user={user} />
    </div>
  );
}
