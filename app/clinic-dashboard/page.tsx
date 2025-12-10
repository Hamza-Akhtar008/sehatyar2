"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  UserPlus, 
  CalendarDays, 
  DollarSign, 
  ArrowUpRight 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { getClinicDashboardOverview } from "@/lib/api/apis";

export default function ClinicDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getClinicDashboardOverview();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch clinic stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  // Transform monthWiseStats for the chart
  // The API returns month format "YYYY-MM", we might want to convert to month name
  const chartData = stats?.totalAppointments?.monthWiseStats?.map((item: any) => {
    const date = new Date(item.month + "-01"); // Append day to make it parseable if needed
    const monthName = date.toLocaleString('default', { month: 'short' });
    return {
      name: monthName,
      appointments: parseInt(item.totalappointments, 10),
      revenue: parseFloat(item.totalrevenue),
    };
  }) || [];

  return (
    <div className="flex min-h-screen w-full flex-col space-y-6">
      
      {/* Top Cards Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Patients */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +0%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-medium text-muted-foreground">Total Patients</div>
              <div className="text-2xl font-bold">{stats?.usersCount?.patientCount || 0}</div>
            </div>
          </CardContent>
        </Card>

        {/* Total Doctors */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +0%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-medium text-muted-foreground">Total Doctors</div>
              <div className="text-2xl font-bold">{stats?.usersCount?.doctorsCount || 0}</div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <CalendarDays className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex items-center text-sm text-green-500 font-medium">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +0%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-medium text-muted-foreground">Appointments</div>
              <div className="text-2xl font-bold">{stats?.totalAppointments?.count || 0}</div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="flex items-center text-sm text-green-500 font-medium">
                 <ArrowUpRight className="mr-1 h-4 w-4" />
                 +0%
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-medium text-muted-foreground">Revenue</div>
              <div className="text-2xl font-bold">{stats?.totalAppointments?.revenue || 0} PKR</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="border-0 shadow-sm bg-white dark:bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
             <ArrowUpRight className="h-5 w-5 text-green-500" />
             Appointments & Revenue
          </CardTitle>
          <CardDescription>Monthly overview of clinic performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    color: '#f3f4f6',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 500, color: '#f3f4f6' }}
                  labelStyle={{ color: '#9ca3af', marginBottom: '8px', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }} 
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#6b7280', fontSize: '14px', textTransform: 'capitalize' }}>{value}</span>}
                />
                <Bar 
                  dataKey="appointments" 
                  name="Appointments" 
                  fill="#4ade80" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
