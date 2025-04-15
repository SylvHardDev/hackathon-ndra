import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Users, Briefcase, Clock, TrendingUp } from "lucide-react";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "Created new project",
    project: "Website Redesign",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Updated task status",
    project: "Mobile App",
    time: "4 hours ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Completed milestone",
    project: "E-commerce Platform",
    time: "6 hours ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,845</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23,455</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} in {activity.project}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Website Launch</p>
                  <p className="text-sm text-muted-foreground">Due in 3 days</p>
                </div>
                <span className="text-sm text-yellow-500 dark:text-yellow-400">
                  High Priority
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Client Meeting</p>
                  <p className="text-sm text-muted-foreground">Tomorrow</p>
                </div>
                <span className="text-sm text-blue-500 dark:text-blue-400">
                  Medium Priority
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Project Review</p>
                  <p className="text-sm text-muted-foreground">Next week</p>
                </div>
                <span className="text-sm text-green-500 dark:text-green-400">
                  Low Priority
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Development Team</p>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[92%] rounded-full bg-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Design Team</p>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[87%] rounded-full bg-primary" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Marketing Team</p>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Website Redesign</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-sm text-muted-foreground">On Track</p>
                  </div>
                </div>
                <p className="text-sm font-medium">75%</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mobile App Development</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <p className="text-sm text-muted-foreground">At Risk</p>
                  </div>
                </div>
                <p className="text-sm font-medium">45%</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Marketing Campaign</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <p className="text-sm text-muted-foreground">In Planning</p>
                  </div>
                </div>
                <p className="text-sm font-medium">20%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}