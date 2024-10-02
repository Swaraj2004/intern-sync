import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { convertUTCToISTWithAMPM } from '@/lib/utils';
import Attendance from '@/types/attendance';
import { useState } from 'react';

const MarkAttendanceCard = ({
  attendance,
  internshipMode,
  isHolidayToday,
  onCheckIn,
  onCheckOut,
}: {
  attendance: Attendance | null | undefined;
  internshipMode: string;
  isHolidayToday: boolean;
  onCheckIn: (workFromHome?: boolean) => void;
  onCheckOut: () => void;
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [workFromHome, setWorkFromHome] = useState(false);
  const [canCheckOut, setCanCheckOut] = useState(true);

  const handleOpenDialog = () => {
    const now = new Date();

    let hours = now.getHours();
    let minutes = now.getMinutes();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12; // Convert to 12-hour format
    hours = hours ? hours : 12; // The hour '0' should be '12'

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const formattedIST = `${hours}:${formattedMinutes} ${ampm}`;

    setCurrentTime(formattedIST);
  };

  return (
    <Card className="flex flex-col flex-grow min-w-[320px] w-1/2">
      <CardContent className="flex flex-col flex-grow gap-5 justify-between pt-6">
        <CardTitle className="text-center">Mark Attendance</CardTitle>
        {isHolidayToday ? (
          <div className="text-center p-6 h-full min-h-40">
            <p className="w-3/4 mx-auto text-muted-foreground">
              It&apos;s a holiday today.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              <p className="text-center">
                <strong>Check in time:</strong>{' '}
                {attendance?.in_time
                  ? convertUTCToISTWithAMPM(attendance?.in_time)
                  : 'N/A'}
              </p>
              <p className="text-center">
                <strong>Check out time:</strong>{' '}
                {attendance?.out_time
                  ? convertUTCToISTWithAMPM(attendance?.out_time)
                  : 'N/A'}
              </p>
            </div>
            {internshipMode === 'hybrid' && !attendance?.in_time && (
              <div className="flex items-center justify-center space-x-3">
                <Checkbox
                  id="work-from-home"
                  checked={workFromHome}
                  onCheckedChange={() => setWorkFromHome(!workFromHome)}
                />
                <label
                  htmlFor="work-from-home"
                  className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Work from home
                </label>
              </div>
            )}
            <div className="flex items-center justify-center space-x-3">
              {internshipMode === 'hybrid' && attendance?.in_time && (
                <>
                  {attendance.work_from_home ? (
                    <Badge>Work form home</Badge>
                  ) : (
                    <Badge>Work in office</Badge>
                  )}
                </>
              )}
            </div>
            {(attendance?.in_time === undefined ||
              attendance?.in_time === null) && (
              <AlertDialog onOpenChange={handleOpenDialog}>
                <AlertDialogTrigger asChild>
                  <Button>Check In</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[calc(100vw-24px)] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Check In Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to check in at {currentTime}. Do you want to
                      proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onCheckIn(workFromHome);
                        setCanCheckOut(false);
                        setTimeout(() => {
                          setCanCheckOut(true);
                        }, 60000);
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {attendance?.in_time && !attendance?.out_time && canCheckOut && (
              <AlertDialog onOpenChange={handleOpenDialog}>
                <AlertDialogTrigger asChild>
                  <Button>Check Out</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[calc(100vw-24px)] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Check Out Confirmation</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to check out at {currentTime}. Do you want
                      to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        onCheckOut();
                      }}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {!canCheckOut && attendance?.in_time && !attendance?.out_time && (
              <p className="text-center text-muted-foreground">
                Check out button will show up after few minutes.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarkAttendanceCard;
