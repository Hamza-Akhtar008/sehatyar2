"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DoctorStats({ appointments = [] }: { appointments?: any[] }) {
  // Aggregate visits by month dynamically
  const monthMap: Record<string, number> = {};
  appointments.forEach(a => {
    if (a.appointmentDate) {
      const date = new Date(a.appointmentDate);
      if (!isNaN(date.getTime())) {
        const month = date.toLocaleString('en-US', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + 1;
      }
    }
  });

  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const patientVisitsData = allMonths.map(month => ({
    month,
    visits: monthMap[month] || 0
  }));

  const totalMonthly = patientVisitsData.reduce((acc, curr) => acc + curr.visits, 0);
  const avgDaily = (totalMonthly / 30).toFixed(1);

  // Still use sample data for satisfaction since appointments don't contain review scores natively
  const satisfactionData = [
    { month: "Jan", score: 4.2 },
    { month: "Feb", score: 4.3 },
    { month: "Mar", score: 4.1 },
    { month: "Apr", score: 4.4 },
    { month: "May", score: 4.5 },
    { month: "Jun", score: 4.6 },
    { month: "Jul", score: 4.7 },
    { month: "Aug", score: 4.6 },
    { month: "Sep", score: 4.8 },
    { month: "Oct", score: 4.7 },
    { month: "Nov", score: 4.9 },
    { month: "Dec", score: 4.8 },
  ]

  return (
    <Tabs defaultValue="visits">
      <TabsList>
        <TabsTrigger value="visits">Patient Visits</TabsTrigger>
        <TabsTrigger value="satisfaction">Patient Satisfaction</TabsTrigger>
      </TabsList>
      <TabsContent value="visits" className="space-y-4">
        <div className="w-full h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={patientVisitsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              {/* <Tooltip /> */}
              <Bar dataKey="visits" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Daily</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDaily}</div>
              <p className="text-xs text-muted-foreground">Based on your dynamic data</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total All Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">Total appointments booked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Yearly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+8.3%</div>
              <p className="text-xs text-muted-foreground">Year over year growth</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="satisfaction" className="space-y-4">
        <div className="w-full h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={satisfactionData}>
              <XAxis dataKey="month" />
              <YAxis domain={[3.5, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">+0.1 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+156 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Would recommend to others</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
