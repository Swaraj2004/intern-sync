'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import SelectInput from '@/components/ui/SelectInput';
import { useAttendanceDate } from '@/context/AttendanceDateContext';
import { useUser } from '@/context/UserContext';
import { formatDateForInput } from '@/lib/utils';
import { useUpsertAttendance } from '@/services/mutations/attendance';
import { zodResolver } from '@hookform/resolvers/zod';
import { SquarePenIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type StudentAttendanceActionsProps = {
  studentId: string;
  internshipId: string;
  attendanceId: string | null;
  attendanceStatus: string | null;
  departmentId?: string;
  collegeMentorId?: string;
};

const statusOptions = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Holiday', value: 'holiday' },
];

const FormSchema = z.object({
  attendanceStatus: z.string().min(1, { message: 'Please select a status.' }),
});

const StudentAttendanceActions = ({
  studentId,
  internshipId,
  attendanceStatus,
  attendanceId,
  departmentId,
  collegeMentorId,
}: StudentAttendanceActionsProps) => {
  const { user } = useUser();
  const { attendanceDate } = useAttendanceDate();
  const [openDialog, setOpenDialog] = useState(false);

  const instituteId: number = user?.user_metadata.institute_id;

  const { upsertAttendance } = useUpsertAttendance({
    instituteId: instituteId,
    departmentId: departmentId,
    collegeMentorId: collegeMentorId,
    attendanceDate: formatDateForInput(attendanceDate),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      attendanceStatus: attendanceStatus || '',
    },
  });

  const handleUpdateAttendance = async (data: z.infer<typeof FormSchema>) => {
    setOpenDialog(false);
    await upsertAttendance(
      attendanceId ? 'update' : 'insert',
      studentId,
      internshipId,
      data.attendanceStatus,
      attendanceId
    );
  };

  return (
    <div className="flex gap-3 justify-end">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button size="icon-sm" className="bg-sky-500 hover:bg-sky-600">
            <SquarePenIcon className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent
          aria-describedby={undefined}
          className="w-[calc(100vw-24px)] min-[450px]:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Update student attendance</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateAttendance)}
                className="space-y-6 pt-3"
              >
                <SelectInput
                  id="attendanceStatus"
                  form={form}
                  label="Status"
                  noLabel
                  placeholder="Choose a status"
                  options={statusOptions}
                />
                <DialogFooter>
                  <Button>Update</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentAttendanceActions;
