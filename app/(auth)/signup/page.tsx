"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Phone, Lock, MapPin, ChevronDown } from "lucide-react";

const PRIMARY_PURPLE = "#4e148c";
const PRIMARY_ORANGE = "#ff6600";

const SignupPage = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center py-10 px-4 bg-gray-50">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-backgound.svg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[480px]">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logo.svg"
            alt="Sehatyar"
            width={220}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        {/* Signup Card */}
        <div className="w-full bg-white rounded-[32px] p-6 sm:p-8 shadow-sm">
          <h1 className="text-[24px] font-bold text-black mb-2">Sign up</h1>
          <p className="text-gray-500 mb-8 text-[14px]">
            Enter your information to create an account
          </p>

          <form className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[14px] font-medium text-black mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Visal Khan"
                  className="w-full h-[52px] rounded-xl bg-[#F3F4F6] border-none pl-12 pr-4 text-[14px] text-black outline-none focus:ring-1 focus:ring-[#4e148c]"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[14px] font-medium text-black mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="03439345400"
                  className="w-full h-[52px] rounded-xl bg-[#F3F4F6] border-none pl-12 pr-4 text-[14px] text-black outline-none focus:ring-1 focus:ring-[#4e148c]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] font-medium text-black mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="w-full h-[52px] rounded-xl bg-[#F3F4F6] border-none pl-12 pr-4 text-[14px] text-black outline-none focus:ring-1 focus:ring-[#4e148c]"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[14px] font-medium text-black mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  className="w-full h-[52px] rounded-xl bg-[#F3F4F6] border-none pl-12 pr-4 text-[14px] text-black outline-none focus:ring-1 focus:ring-[#4e148c]"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-[14px] font-medium text-black mb-2">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Abbottabad"
                  className="w-full h-[52px] rounded-xl bg-[#F3F4F6] border-none pl-12 pr-10 text-[14px] text-black outline-none focus:ring-1 focus:ring-[#4e148c]"
                />
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-2">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#4e148c] focus:ring-[#4e148c]"
                />
              </div>
              <label
                htmlFor="terms"
                className="text-[13px] text-gray-500 leading-tight"
              >
                I agree to the{" "}
                <span style={{ color: PRIMARY_ORANGE }}>Terms of Service</span>{" "}
                and{" "}
                <span style={{ color: PRIMARY_ORANGE }}>Privacy Policy</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-wipe-up w-full h-[52px] rounded-xl font-semibold text-[16px] text-white mt-4 transition-colors duration-300"
              style={{ backgroundColor: PRIMARY_PURPLE }}
            >
              <span className="relative z-10">Create account</span>
            </button>

            {/* Sign In Link */}
            <div className="text-center text-[14px] text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium hover:underline"
                style={{ color: PRIMARY_ORANGE }}
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
