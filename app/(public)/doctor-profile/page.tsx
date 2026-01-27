import dynamic from "next/dynamic";

const DoctorProfile = dynamic(() => import("@/components/landing/doctor-profile"), {
  ssr: true,
});

export const metadata = {
  title: "Doctor Profile | SehatYar",
};

export default function Page() {
  return <DoctorProfile />;
}
