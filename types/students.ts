// type Student = {
//   uid: string;
//   college_mentors: {
//     uid: string;
//     users: {
//       id: string;
//       name: string;
//     } | null;
//   } | null;
//   departments: {
//     uid: string;
//     name: string;
//   } | null;
//   users: {
//     id: string;
//     auth_id: string | null;
//     name: string;
//     email: string;
//     is_registered: boolean;
//     is_verified: boolean;
//   } | null;
//   internships:
//     | {
//         start_date: string;
//         end_date: string;
//         company_mentor_id: string | null;
//         company_mentors: {
//           uid: string;
//           users: {
//             id: string;
//             name: string;
//           } | null;
//         } | null;
//       }[];
// };

type Student = {
  uid: string;
  name: string;
  email: string;
  auth_id: string;
  is_registered: boolean;
  is_verified: boolean;
  college_mentor_uid: string;
  college_mentor_name: string;
  company_mentor_uid: string;
  company_mentor_name: string;
  department_uid: string;
  department_name: string;
};

export default Student;
