"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--grey-900)] min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-[var(--brand-green-500)] text-white">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-[var(--brand-light-green)]">SehatYar</span>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-[var(--brand-green-300)]">
            Empowering healthcare professionals, hospitals, and patients through one seamless digital platform.
          </p>
        </div>

        <div className="absolute inset-0 opacity-10">
          <Image
            src="/assets/medical-pattern.svg"
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4 text-[var(--brand-green-900)]">
              Who We Are
            </h2>
            <p className="text-[var(--grey-700)] leading-relaxed mb-4">
              SehatYar is a comprehensive healthcare management system designed in Abbottabad, Pakistan.
              We bridge the gap between doctors, patients, hospitals, and receptionists — bringing all stakeholders together under one unified platform.
            </p>
            <p className="text-[var(--grey-700)] leading-relaxed">
              From booking appointments to managing medical records, billing, and communication — SehatYar streamlines every process so healthcare providers can focus on what truly matters: patient care.
            </p>
          </div>
          <div className="relative w-full h-72 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/images/about-us.jpg"
              alt="Hospital and technology"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-[var(--card)] py-16">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-semibold mb-6 text-[var(--brand-green-900)]">
            Our Mission
          </h2>
          <p className="max-w-3xl mx-auto text-[var(--grey-700)] leading-relaxed">
            Our mission is to make healthcare management effortless and accessible. 
            SehatYar aims to digitize the entire patient journey — from appointment scheduling 
            and prescriptions to hospital management — helping both large institutions 
            and independent practitioners deliver better experiences.
          </p>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="container mx-auto px-6 md:px-12 py-16">
        <h2 className="text-3xl font-semibold mb-10 text-center text-[var(--brand-green-900)]">
          Why Choose SehatYar
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "For Doctors",
              desc: "Manage your appointments, patient records, and prescriptions easily in one place.",
              icon: "/assets/doctor-icon.svg",
            },
            {
              title: "For Hospitals",
              desc: "Coordinate departments, streamline billing, and optimize administrative workflows.",
              icon: "/assets/hospital-buildings-svgrepo-com.svg",
            },
            {
              title: "For Patients",
              desc: "Find trusted doctors, book appointments online, and manage your health records digitally.",
              icon: "/assets/hospital-patient-icon.svg",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-[var(--border)] rounded-lg shadow-sm p-6 text-center hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--brand-green-700)]">
                {item.title}
              </h3>
              <p className="text-[var(--grey-700)] text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-[var(--brand-green-700)] text-white py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Join the SehatYar Network</h2>
        <p className="max-w-2xl mx-auto mb-8 text-[var(--brand-green-300)]">
          Whether you're a doctor, hospital, or patient — SehatYar is your trusted digital healthcare companion.
        </p>
        <Link
          href="/register"
          className="inline-block bg-[var(--accent-green)] text-black px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}
