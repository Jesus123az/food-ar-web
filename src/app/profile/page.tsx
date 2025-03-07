import Profile from "@/components/Profile/index";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is the Profile page for TailAdmin Tailwind CSS Admin Dashboard Template",
};

const ProfilePage = () => {
  return (
    <DefaultLayout>
      <Profile />
    </DefaultLayout>
  );
};

export default ProfilePage;