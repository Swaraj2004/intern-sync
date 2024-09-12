import deleteUserById from '@/server/delete-user';
import sendInviteEmail from '@/server/send-invite';
import updateUserByAuthId from '@/server/update-user';
import { useStudents } from '@/services/queries';
import Students from '@/types/students';
import { supabaseClient } from '@/utils/supabase/client';
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-swr';
import { useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useAddStudent = ({
  userId,
  instituteId,
  departmentId,
}: {
  userId: string;
  instituteId: number;
  departmentId?: string;
}) => {
  const { mutate } = useStudents({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = async (
    studentName: string,
    email: string,
    departmentId: string,
    departmentName: string,
    sendInvite: boolean,
    collegeMentorId?: string,
    collegeMentorName?: string,
    contact?: number,
    dob?: string
  ) => {
    setIsLoading(true);

    const optimisticUpdate: Students = {
      uid: crypto.randomUUID(),
      departments: {
        uid: departmentId,
        name: departmentName,
      },
      users: {
        id: crypto.randomUUID(),
        auth_id: null,
        name: studentName,
        email,
        is_registered: sendInvite,
        is_verified: false,
      },
      college_mentors: {
        uid: collegeMentorId || crypto.randomUUID(),
        users: {
          id: collegeMentorId || crypto.randomUUID(),
          name: collegeMentorName || '',
        },
      },
    };

    mutate((currentData) => {
      if (!currentData?.data) return undefined;
      return {
        ...currentData,
        data: [optimisticUpdate, ...currentData.data],
      };
    }, false);

    try {
      const { data, error } = await supabase.rpc('add_student', {
        student_name: studentName,
        email,
        institute_id: instituteId,
        department_id: departmentId,
        requesting_user_id: userId,
        academic_year: new Date().getFullYear(),
        college_mentor_id: collegeMentorId || undefined,
        contact: contact || undefined,
        dob: dob || undefined,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      const result = data[0];

      if (result && !result.is_new_user && !result.has_role && result.auth_id) {
        await updateUserByAuthId(result.auth_id, 'student', studentName);
        toast.success('User already exists, assigned student role.');
      } else if (result && !result.is_verified && sendInvite) {
        const inviteData = await sendInviteEmail(
          email,
          result.user_id,
          studentName,
          instituteId
        );

        if (inviteData) {
          await supabase
            .from('users')
            .update({ is_registered: true, auth_id: inviteData.user.id })
            .eq('id', result.user_id);
        }

        toast.success('Student added and invite sent.');
      } else {
        toast.success('Student added successfully.');
      }
    } catch (error) {
      toast.error('Failed to add student. Reverting changes...');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    addStudent,
    isLoading,
  };
};

export const useDeleteStudent = ({
  instituteId,
  departmentId,
  requestingUserId,
}: {
  instituteId: number;
  departmentId?: string;
  requestingUserId: string;
}) => {
  const { mutate } = useStudents({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const deleteStudent = async (userId: string, authId: string | null) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;
      return {
        ...currentData,
        data: currentData.data.filter((student) => student.uid !== userId),
      };
    }, false);

    try {
      const { data, error } = await supabase.rpc('delete_student', {
        user_id: userId,
        institute_id: instituteId,
        requesting_user_id: requestingUserId,
        department_id: departmentId,
      });

      if (error) {
        toast.error(error.details);
        return;
      }

      const result = data as { is_user_deleted: boolean } | null;

      if (authId && result && !result.is_user_deleted) {
        await updateUserByAuthId(authId, 'student', undefined, 'remove');
        toast.success('Student role deleted successfully.');
      } else if (authId && result && result.is_user_deleted) {
        await deleteUserById(authId);
        toast.success('Student deleted successfully.');
      } else {
        toast.success('Student deleted successfully.');
      }
    } catch (error) {
      toast.error('Failed to delete student. Reverting changes...');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    deleteStudent,
    isLoading,
  };
};

export const useChangeCollegeMentor = ({
  instituteId,
  departmentId,
}: {
  instituteId: number;
  departmentId?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { trigger: updateMentor } = useUpdateMutation(
    supabase.from('students'),
    ['uid'],
    'college_mentor_id',
    {
      onSuccess: () => toast.success('College mentor updated successfully.'),
      onError: (error) => toast.error('Failed to update college mentor.'),
    }
  );

  const changeCollegeMentor = async (
    studentId: string,
    newMentorId: string,
    newMentorName: string
  ) => {
    setIsLoading(true);

    await updateMentor({
      uid: studentId,
      college_mentor_id: newMentorId,
    });
    setIsLoading(false);
  };

  return {
    changeCollegeMentor,
    isLoading,
  };
};

export const useSendStudentInvite = ({
  instituteId,
  departmentId,
}: {
  instituteId: number;
  departmentId?: string;
}) => {
  const { mutate } = useStudents({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = async (email: string, userId: string, name: string) => {
    setIsLoading(true);

    mutate((currentData) => {
      if (!currentData?.data) return undefined;
      return {
        ...currentData,
        data: currentData.data.map((student) =>
          student.uid === userId
            ? {
                ...student,
                users: student.users
                  ? { ...student.users, is_registered: true }
                  : student.users,
              }
            : student
        ),
      };
    }, false);

    try {
      const { user } = await sendInviteEmail(email, userId, name, instituteId);

      await supabase
        .from('users')
        .update({ is_registered: true, auth_id: user.id })
        .eq('id', userId);

      toast.success('Invite email sent successfully.');
    } catch (error) {
      toast.error('Failed to send invite.');
    } finally {
      mutate();
      setIsLoading(false);
    }
  };

  return {
    sendInvite,
    isLoading,
  };
};
