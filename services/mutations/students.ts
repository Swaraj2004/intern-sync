import deleteUserById from '@/server/delete-user';
import sendInviteEmail from '@/server/send-invite';
import { useStudents } from '@/services/queries';
import Student from '@/types/students';
import { supabaseClient } from '@/utils/supabase/client';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const supabase = supabaseClient();

export const useAddStudent = ({
  userId,
  instituteId,
  departmentId,
}: {
  userId: string;
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useStudents({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const addStudent = useCallback(
    async (
      studentName: string,
      email: string,
      departmentId: string,
      departmentName: string,
      sendInvite: boolean,
      collegeMentorId?: string,
      collegeMentorName?: string
    ) => {
      setIsLoading(true);

      const optimisticUpdate: Student = {
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
        internships: [],
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
        });

        if (error) {
          toast.error(error.message);
          return;
        }

        const result = data[0];

        if (
          result &&
          !result.is_new_user &&
          !result.has_role &&
          result.auth_id
        ) {
          toast.success('User already exists, assigned student role.');
        } else if (result && !result.is_verified && sendInvite) {
          const inviteData = await sendInviteEmail(email, result.user_id);

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
    },
    [instituteId, userId, mutate]
  );

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
  instituteId: string;
  departmentId?: string;
  requestingUserId: string;
}) => {
  const { mutate } = useStudents({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const deleteStudent = useCallback(
    async (userId: string, authId: string | null) => {
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
    },
    [instituteId, departmentId, requestingUserId, mutate]
  );

  return {
    deleteStudent,
    isLoading,
  };
};

export const useChangeCollegeMentor = ({
  instituteId,
  departmentId,
}: {
  instituteId: string;
  departmentId?: string;
}) => {
  const { mutate } = useStudents({ instituteId, departmentId });
  const [isLoading, setIsLoading] = useState(false);

  const changeCollegeMentor = useCallback(
    async (studentId: string, newMentorId: string, newMentorName: string) => {
      setIsLoading(true);

      mutate((currentData) => {
        if (!currentData?.data) return undefined;
        return {
          ...currentData,
          data: currentData.data.map((student) =>
            student.uid === studentId
              ? {
                  ...student,
                  college_mentors: {
                    uid: newMentorId,
                    users: { id: newMentorId, name: newMentorName },
                  },
                }
              : student
          ),
        };
      }, false);

      try {
        const { error } = await supabase.rpc('change_college_mentor', {
          student_id: studentId,
          new_college_mentor_id: newMentorId,
        });

        if (error) {
          throw new Error(error.details);
        }

        toast.success('College mentor updated successfully.');
      } catch (error) {
        if (typeof error === 'string') toast.error(error);
        else toast.error('Failed to update college mentor.');
      } finally {
        mutate();
        setIsLoading(false);
      }
    },
    [mutate]
  );

  return {
    changeCollegeMentor,
    isLoading,
  };
};

export const useSendStudentInvite = ({
  instituteId,
  departmentId,
  collegeMentorId,
}: {
  instituteId: string;
  departmentId?: string;
  collegeMentorId?: string;
}) => {
  const { mutate } = useStudents({
    instituteId,
    departmentId,
    collegeMentorId,
  });
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = useCallback(
    async (email: string, userId: string) => {
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
        const { user } = await sendInviteEmail(email, userId);

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
    },
    [mutate]
  );

  return {
    sendInvite,
    isLoading,
  };
};
