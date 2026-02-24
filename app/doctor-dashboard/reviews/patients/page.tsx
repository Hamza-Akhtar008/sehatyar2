"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDoctorProfileByDoctorId } from "@/lib/Api/Doctor/doctor_api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PatientReviewsPage() {
  const [rawReviews, setRawReviews] = useState<any[]>([])
  const [reviewCount, setReviewCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
        if (storedDoctorId) {
          const profile = await getDoctorProfileByDoctorId(Number(storedDoctorId));
          if (profile && profile.reviews) {
            setRawReviews(profile.reviews);
            setReviewCount(profile.reviewCount || profile.reviews.length);
          }
        }
      } catch (error) {
        console.error("Failed to fetch doctor profile and reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const patientReviews = rawReviews.map((r: any) => ({
    id: r.id?.toString(),
    patientName: r.patient?.user?.fullName || `Patient #${r.patientId || "Unknown"}`,
    rating: r.ratings || 5, // Fallback to 5 if null as per API data
    date: r.createdAt || new Date().toISOString(),
    title: r.title || "Feedback",
    content: r.content || "",
  }));


  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading reviews...</div>
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold tracking-tight">Patient Reviews</h2>
          <p className="text-muted-foreground">Overview of patient feedback and ratings.</p>
        </div>
      </div>


      <div className="space-y-4">
        {patientReviews.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">No reviews found.</div>
        ) : (
          patientReviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/user-3.png?height=40&width=40&query=${review.patientName}`}
                      alt={review.patientName}
                    />
                    <AvatarFallback>
                      {review.patientName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(review.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground font-medium">Review by {review.patientName}</div>
                  <p className="text-sm leading-relaxed">{review.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
