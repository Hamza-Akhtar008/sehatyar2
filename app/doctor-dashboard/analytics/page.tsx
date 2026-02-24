"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto space-y-8 p-4 md:p-6 lg:p-8 text-black">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-black">Analytics Overview</h2>
        <p className="text-black/80">Monitor your patient engagement and clinic performance over time.</p>
      </div>

      {/* Metric Cards Top Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-md font-semibold text-black">Total Patients</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">1,248</div>
            <p className="text-xs text-black/80 mt-1">
              <span className="text-emerald-600 font-medium">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-md font-semibold text-black">Appointments</CardTitle>
            <Calendar className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">143</div>
            <p className="text-xs text-black/80 mt-1">
              <span className="text-emerald-600 font-medium">+4%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-md font-semibold text-black">Consultation Time</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">12m Avg</div>
            <p className="text-xs text-black/80 mt-1">
              <span className="text-red-600 font-medium">-1m</span> shorter than average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-md font-semibold text-black">Revenue Est</CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">$12,450</div>
            <p className="text-xs text-black/80 mt-1">
              <span className="text-emerald-600 font-medium">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-black">Patient Visits</CardTitle>
            <CardDescription className="text-black/80">Monthly breakdown of clinic vs online consultations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-md border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-black/60">
              [ Bar Chart Placeholder area ]
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-black">Top Diagnoses</CardTitle>
            <CardDescription className="text-black/80">Frequency of common condition treatments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full rounded-md border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-black/60 gap-4">
               <div>[ Pie Chart Placeholder area ]</div>
               <div className="flex gap-4 text-xs font-medium text-black">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Hypertension</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Diabetes</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
