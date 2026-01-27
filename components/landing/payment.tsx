"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postAppointment } from "@/lib/Api/appointment";
import { useAuth } from "@/context/AuthContext";

type Method = "card" | "easypaisa" | "jazzcash" | "bank";

const PRIMARY_PURPLE = "#4e148c";

export default function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [method, setMethod] = useState<Method>("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  // Get booking info from query params
  const doctorId = Number(searchParams.get("doctorId"));
  const appointmentTime = searchParams.get("time") || "";
  const appointmentDate = searchParams.get("date") || "";
  const patientName = searchParams.get("patientName") || "";
  const phoneNumber = searchParams.get("phoneNumber") || "";
  const email = searchParams.get("email") || "";
  const notes = searchParams.get("notes") || "";
  const appointmentFor = searchParams.get("appointmentFor") || "myself";
  const paymentMethod = searchParams.get("paymentMethod") || "online";
  const amount = searchParams.get("amount") || "5000";

  // Get userId from context or localStorage
  const userId = user?.id ? Number(user.id) : (() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('user');
      if (u) try { return Number(JSON.parse(u).id); } catch { return 0; }
    }
    return 0;
  })();

  const methods: Array<{
    id: Method;
    label: string;
    icon: string;
    sub?: string;
  }> = [
    { id: "card", label: "Credit or Debit Card", icon: "/visa.svg" },
    { id: "easypaisa", label: "EasyPaisa", icon: "/easypaisa.svg" },
    { id: "jazzcash", label: "Jazz Cash", icon: "/jazzcash.svg" },
    { id: "bank", label: "Bank Transfer", icon: "/bank.svg" },
  ];

  const handlePayment = async () => {
    // Validate card details if using card payment
    if (method === "card") {
      if (!cardNumber.trim() || cardNumber.length < 16) {
        setError("Please enter a valid card number");
        return;
      }
      if (!cvv.trim() || cvv.length < 3) {
        setError("Please enter a valid CVV");
        return;
      }
      if (!expiry.trim()) {
        setError("Please enter card expiry date");
        return;
      }
      if (!cardHolder.trim()) {
        setError("Please enter card holder name");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await postAppointment({
        patientName,
        phoneNumber,
        email,
        paymentMethod: "online",
        amount,
        notes,
        appointmentDate,
        appointmentTime,
        appointmentFor,
        doctorId,
        userId,
      });
      setSuccess(true);

      const redirectPath = user?.role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard";
      setTimeout(() => router.push(redirectPath), 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to process payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full">
      <section className="mx-auto w-full max-w-[1370px] px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          {/* Left: Payment form */}
          <Card className="rounded-2xl bg-[#F8F8F8]">
            <CardContent className="p-4 md:p-6">
              <div className="text-[16px] md:text-[18px] font-semibold text-[#414141] mb-4">
                Complete your payment
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                {methods.map((m) => {
                  const active = method === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id)}
                      className={`flex items-center justify-between w-full rounded-[12px] border px-4 py-3 transition-colors text-left ${
                        active ? "border-[#4e148c] bg-white" : "border-[#E5E5E5] bg-white hover:border-[#4e148c]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={m.icon}
                          alt={m.label}
                          width={36}
                          height={24}
                          className="object-contain"
                        />
                        <span className="text-[14px] md:text-[15px] text-[#414141]">{m.label}</span>
                      </div>
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? "border-[#4e148c]" : "border-[#D1D5DB]"
                        }`}
                        aria-hidden
                      >
                        {active && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#4e148c]" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Card Details Form (shown when card is selected) */}
              {method === "card" && (
                <div className="space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-4 md:p-5">
                  <div className="space-y-2">
                    <Label className="text-[14px] font-semibold text-[#414141]">Card Number</Label>
                    <Input
                      placeholder="4242 4242 4242 4242"
                      className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      maxLength={16}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[14px] font-semibold text-[#414141]">CVV</Label>
                      <Input
                        placeholder="123"
                        className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                        value={cvv}
                        onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                        type="password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[14px] font-semibold text-[#414141]">Expiry</Label>
                      <Input
                        placeholder="MM/YY"
                        className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                        maxLength={5}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[14px] font-semibold text-[#414141]">Card Holder</Label>
                    <Input
                      placeholder="John Doe"
                      className="h-11 rounded-[12px] border-[#E5E7EB] text-[14px] placeholder:text-[#9CA3AF]"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Payment details */}
          <Card className="rounded-2xl bg-[#F8F8F8] h-fit">
            <CardContent className="p-4 md:p-6">
              <div className="text-[18px] font-semibold text-[#414141] mb-4">Payment Details</div>

              <div className="space-y-3 text-[14px] text-[#414141]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {Number(amount).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-[16px] pt-2 border-t border-[#E5E5E5]">
                  <span>Total</span>
                  <span>Rs. {Number(amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full h-11 rounded-full text-[14px] font-medium bg-[#4e148c] hover:bg-[#ff6600] text-white transition-colors duration-200"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Pay Rs. ${Number(amount).toLocaleString()}`}
                </Button>
                {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
                {success && <div className="text-green-600 mt-2 text-sm">Payment successful! Redirecting...</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
