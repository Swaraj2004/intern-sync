'use client';

import { CheckCircle } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

export default function CurrentAttendanceChart({
  totalWorkingDays = 0,
  totalPresentDays = 0,
}: {
  totalWorkingDays: number;
  totalPresentDays: number;
}) {
  const attendancePercentage = (totalPresentDays / totalWorkingDays) * 100;
  const data = [
    { name: 'Present', value: attendancePercentage },
    { name: 'Absent', value: 100 - attendancePercentage },
  ];

  return (
    <Card className="min-w-[320px]">
      <CardHeader className="text-center">
        <CardTitle>Current Attendance</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[175px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    strokeWidth={0}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-2xl font-bold">
              {attendancePercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium">
          {totalPresentDays} days present out of {totalWorkingDays}{' '}
          <CheckCircle className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
