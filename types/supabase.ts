export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          date: string
          id: string
          in_time: string | null
          internship_id: string
          out_time: string | null
          status: string | null
          student_id: string
          work_from_home: boolean
        }
        Insert: {
          date: string
          id?: string
          in_time?: string | null
          internship_id: string
          out_time?: string | null
          status?: string | null
          student_id: string
          work_from_home?: boolean
        }
        Update: {
          date?: string
          id?: string
          in_time?: string | null
          internship_id?: string
          out_time?: string | null
          status?: string | null
          student_id?: string
          work_from_home?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "attendance_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["uid"]
          },
        ]
      }
      college_mentors: {
        Row: {
          created_at: string
          department_id: string
          institute_id: string
          uid: string
        }
        Insert: {
          created_at?: string
          department_id: string
          institute_id: string
          uid: string
        }
        Update: {
          created_at?: string
          department_id?: string
          institute_id?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_mentors_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "college_mentors_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "college_mentors_uid_fkey"
            columns: ["uid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_mentors: {
        Row: {
          company_address: string | null
          company_latitude: number | null
          company_longitude: number | null
          company_name: string | null
          company_radius: number | null
          created_at: string
          designation: string | null
          uid: string
        }
        Insert: {
          company_address?: string | null
          company_latitude?: number | null
          company_longitude?: number | null
          company_name?: string | null
          company_radius?: number | null
          created_at?: string
          designation?: string | null
          uid: string
        }
        Update: {
          company_address?: string | null
          company_latitude?: number | null
          company_longitude?: number | null
          company_name?: string | null
          company_radius?: number | null
          created_at?: string
          designation?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_mentors_uid_fkey"
            columns: ["uid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          institute_id: string
          name: string
          uid: string
        }
        Insert: {
          created_at?: string
          institute_id: string
          name: string
          uid: string
        }
        Update: {
          created_at?: string
          institute_id?: string
          name?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "departments_uid_fkey"
            columns: ["uid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluation_responses: {
        Row: {
          eval_id: string | null
          id: string
          mentor_eval_id: string | null
          parameter_id: string | null
          student_id: string | null
          value: string
        }
        Insert: {
          eval_id?: string | null
          id?: string
          mentor_eval_id?: string | null
          parameter_id?: string | null
          student_id?: string | null
          value: string
        }
        Update: {
          eval_id?: string | null
          id?: string
          mentor_eval_id?: string | null
          parameter_id?: string | null
          student_id?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluation_responses_eval_id_fkey"
            columns: ["eval_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_responses_mentor_eval_id_fkey"
            columns: ["mentor_eval_id"]
            isOneToOne: false
            referencedRelation: "mentor_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_responses_parameter_id_fkey"
            columns: ["parameter_id"]
            isOneToOne: false
            referencedRelation: "parameters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evaluation_responses_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          date: string
          department_id: string | null
          id: string
          institute_id: string | null
          name: string
        }
        Insert: {
          date: string
          department_id?: string | null
          id?: string
          institute_id?: string | null
          name: string
        }
        Update: {
          date?: string
          department_id?: string | null
          id?: string
          institute_id?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "evaluations_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["uid"]
          },
        ]
      }
      guest_creds: {
        Row: {
          email: string
          password: string
          role: string
        }
        Insert: {
          email: string
          password: string
          role: string
        }
        Update: {
          email?: string
          password?: string
          role?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          description: string | null
          holiday_date: string
          holiday_type: string
          id: string
          name: string
          region: string | null
        }
        Insert: {
          description?: string | null
          holiday_date: string
          holiday_type: string
          id?: string
          name: string
          region?: string | null
        }
        Update: {
          description?: string | null
          holiday_date?: string
          holiday_type?: string
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      institutes: {
        Row: {
          address: string | null
          aicte_id: string
          created_at: string
          institute_email_domain: string | null
          internship_approval_format_url: string | null
          name: string
          student_email_domain: string | null
          uid: string
        }
        Insert: {
          address?: string | null
          aicte_id: string
          created_at?: string
          institute_email_domain?: string | null
          internship_approval_format_url?: string | null
          name: string
          student_email_domain?: string | null
          uid: string
        }
        Update: {
          address?: string | null
          aicte_id?: string
          created_at?: string
          institute_email_domain?: string | null
          internship_approval_format_url?: string | null
          name?: string
          student_email_domain?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutes_uid_fkey"
            columns: ["uid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_reports: {
        Row: {
          created_at: string
          details: string
          division: string
          feedback: string | null
          id: string
          internship_id: string
          main_points: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          details: string
          division: string
          feedback?: string | null
          id: string
          internship_id: string
          main_points: string
          status: string
          student_id: string
        }
        Update: {
          created_at?: string
          details?: string
          division?: string
          feedback?: string | null
          id?: string
          internship_id?: string
          main_points?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internship_reports_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "attendance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internship_reports_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internship_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["uid"]
          },
        ]
      }
      internships: {
        Row: {
          approved: boolean
          college_mentor_id: string
          company_address: string
          company_mentor_email: string | null
          company_mentor_id: string | null
          company_name: string
          created_at: string
          department_id: string
          end_date: string
          field: string
          id: string
          institute_id: string
          internship_letter_url: string
          mode: string
          region: string
          role: string
          start_date: string
          student_id: string
        }
        Insert: {
          approved?: boolean
          college_mentor_id: string
          company_address: string
          company_mentor_email?: string | null
          company_mentor_id?: string | null
          company_name: string
          created_at?: string
          department_id: string
          end_date: string
          field: string
          id?: string
          institute_id: string
          internship_letter_url: string
          mode: string
          region: string
          role: string
          start_date: string
          student_id: string
        }
        Update: {
          approved?: boolean
          college_mentor_id?: string
          company_address?: string
          company_mentor_email?: string | null
          company_mentor_id?: string | null
          company_name?: string
          created_at?: string
          department_id?: string
          end_date?: string
          field?: string
          id?: string
          institute_id?: string
          internship_letter_url?: string
          mode?: string
          region?: string
          role?: string
          start_date?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "internships_college_mentor_id_fkey"
            columns: ["college_mentor_id"]
            isOneToOne: false
            referencedRelation: "college_mentors"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "internships_company_mentor_id_fkey"
            columns: ["company_mentor_id"]
            isOneToOne: false
            referencedRelation: "company_mentors"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "internships_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "internships_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "internships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["uid"]
          },
        ]
      }
      mentor_evaluations: {
        Row: {
          college_mentor_id: string | null
          eval_id: string | null
          eval_toggle: boolean
          evaluator_id: string | null
          id: string
        }
        Insert: {
          college_mentor_id?: string | null
          eval_id?: string | null
          eval_toggle: boolean
          evaluator_id?: string | null
          id?: string
        }
        Update: {
          college_mentor_id?: string | null
          eval_id?: string | null
          eval_toggle?: boolean
          evaluator_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_evaluations_college_mentor_id_fkey"
            columns: ["college_mentor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_evaluations_eval_id_fkey"
            columns: ["eval_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      parameters: {
        Row: {
          eval_id: string | null
          id: string
          role: string
          score: number
          text: string
        }
        Insert: {
          eval_id?: string | null
          id?: string
          role: string
          score: number
          text: string
        }
        Update: {
          eval_id?: string | null
          id?: string
          role?: string
          score?: number
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "parameters_eval_id_fkey"
            columns: ["eval_id"]
            isOneToOne: false
            referencedRelation: "evaluations"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_attendance_requests: {
        Row: {
          approved: boolean
          college_mentor_id: string
          created_at: string
          date: string
          description: string
          id: string
          internship_id: string
          request_type: string
          student_id: string
        }
        Insert: {
          approved?: boolean
          college_mentor_id: string
          created_at?: string
          date: string
          description: string
          id?: string
          internship_id: string
          request_type: string
          student_id: string
        }
        Update: {
          approved?: boolean
          college_mentor_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          internship_id?: string
          request_type?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_attendance_requests_college_mentor_id_fkey"
            columns: ["college_mentor_id"]
            isOneToOne: false
            referencedRelation: "college_mentors"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "student_attendance_requests_internship_id_fkey"
            columns: ["internship_id"]
            isOneToOne: false
            referencedRelation: "internships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_attendance_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["uid"]
          },
        ]
      }
      students: {
        Row: {
          academic_year: number
          address: string | null
          admission_id: string | null
          admission_year: number | null
          college_mentor_id: string | null
          created_at: string
          department_id: string
          division: string | null
          dob: string | null
          home_latitude: number | null
          home_longitude: number | null
          home_radius: number | null
          institute_id: string
          roll_no: string | null
          uid: string
        }
        Insert: {
          academic_year: number
          address?: string | null
          admission_id?: string | null
          admission_year?: number | null
          college_mentor_id?: string | null
          created_at?: string
          department_id: string
          division?: string | null
          dob?: string | null
          home_latitude?: number | null
          home_longitude?: number | null
          home_radius?: number | null
          institute_id: string
          roll_no?: string | null
          uid: string
        }
        Update: {
          academic_year?: number
          address?: string | null
          admission_id?: string | null
          admission_year?: number | null
          college_mentor_id?: string | null
          created_at?: string
          department_id?: string
          division?: string | null
          dob?: string | null
          home_latitude?: number | null
          home_longitude?: number | null
          home_radius?: number | null
          institute_id?: string
          roll_no?: string | null
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_college_mentor_id_fkey"
            columns: ["college_mentor_id"]
            isOneToOne: false
            referencedRelation: "college_mentors"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "students_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "students_uid_fkey"
            columns: ["uid"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          uid: string
        }
        Insert: {
          role_id: string
          uid: string
        }
        Update: {
          role_id?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          contact: number | null
          created_at: string
          email: string
          id: string
          is_registered: boolean
          is_verified: boolean
          name: string
        }
        Insert: {
          auth_id?: string | null
          contact?: number | null
          created_at?: string
          email: string
          id?: string
          is_registered?: boolean
          is_verified?: boolean
          name: string
        }
        Update: {
          auth_id?: string | null
          contact?: number | null
          created_at?: string
          email?: string
          id?: string
          is_registered?: boolean
          is_verified?: boolean
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_college_mentor: {
        Args: {
          mentor_name: string
          email: string
          institute_id: string
          department_id: string
          requesting_user_id: string
        }
        Returns: {
          user_id: string
          auth_id: string
          is_new_user: boolean
          has_role: boolean
          is_verified: boolean
        }[]
      }
      add_department_coordinator: {
        Args: {
          department_coordinator_name: string
          email: string
          department_name: string
          institute_id: string
          requesting_user_id: string
        }
        Returns: {
          user_id: string
          auth_id: string
          is_new_user: boolean
          has_role: boolean
          is_verified: boolean
        }[]
      }
      add_student: {
        Args: {
          student_name: string
          email: string
          institute_id: string
          department_id: string
          requesting_user_id: string
          academic_year: number
          college_mentor_id?: string
        }
        Returns: {
          user_id: string
          auth_id: string
          is_new_user: boolean
          has_role: boolean
          is_verified: boolean
        }[]
      }
      approve_student_attendance_requests: {
        Args: {
          request_id: string
          mentor_approval: boolean
        }
        Returns: undefined
      }
      change_college_mentor: {
        Args: {
          student_id: string
          new_college_mentor_id: string
        }
        Returns: undefined
      }
      check_holiday_for_student: {
        Args: {
          student_id: string
          internship_id: string
          check_date: string
        }
        Returns: boolean
      }
      delete_college_mentor: {
        Args: {
          user_id: string
          institute_id: string
          requesting_user_id: string
          department_id?: string
        }
        Returns: Json
      }
      delete_department: {
        Args: {
          user_id: string
          institute_id: string
          requesting_user_id: string
        }
        Returns: Json
      }
      delete_student: {
        Args: {
          user_id: string
          institute_id: string
          requesting_user_id: string
          department_id?: string
        }
        Returns: Json
      }
      get_internship_details: {
        Args: {
          internship_id: string
        }
        Returns: {
          role: string
          field: string
          mode: string
          start_date: string
          end_date: string
          company_mentor_email: string
          company_name: string
          company_address: string
          internship_letter_url: string
          approved: boolean
          college_mentor_uid: string
          college_mentor_name: string
          company_mentor_uid: string
          company_mentor_name: string
          company_mentor_designation: string
          company_longitude: number
          company_latitude: number
          company_radius: number
          student_uid: string
          student_home_longitude: number
          student_home_latitude: number
          student_home_radius: number
          student_name: string
        }[]
      }
      get_student_reports: {
        Args: {
          student_id: string
          from_date: string
          to_date: string
        }
        Returns: {
          report_date: string
          user_name: string
          college_mentor_uid: string
          college_mentor_name: string
          has_internship: boolean
          attendance_id: string
          attendance_status: string
          in_time: string
          out_time: string
          work_from_home: boolean
          report_division: string
          report_details: string
          report_main_points: string
          report_feedback: string
          report_status: string
          is_holiday: boolean
        }[]
      }
      get_students_attendance: {
        Args: {
          institute_id: string
          attendance_date: string
          department_id?: string
          college_mentor_id?: string
        }
        Returns: {
          student_uid: string
          user_name: string
          college_mentor_uid: string
          college_mentor_name: string
          department_uid: string
          department_name: string
          current_internship_id: string
          internship_start_date: string
          internship_end_date: string
          attendance_id: string
          attendance_status: string
          in_time: string
          out_time: string
          work_from_home: boolean
          is_holiday: boolean
        }[]
      }
      get_students_attendance_for_company_mentor: {
        Args: {
          company_mentor_id: string
          attendance_date: string
        }
        Returns: {
          student_uid: string
          user_name: string
          company_mentor_uid: string
          company_mentor_name: string
          department_uid: string
          department_name: string
          current_internship_id: string
          internship_start_date: string
          internship_end_date: string
          attendance_id: string
          attendance_status: string
          in_time: string
          out_time: string
          work_from_home: boolean
          is_holiday: boolean
        }[]
      }
      get_students_reports: {
        Args: {
          institute_id: string
          report_date: string
          department_id?: string
          college_mentor_id?: string
        }
        Returns: {
          student_uid: string
          user_name: string
          college_mentor_uid: string
          college_mentor_name: string
          current_internship_id: string
          internship_start_date: string
          internship_end_date: string
          attendance_id: string
          attendance_status: string
          attendance_date: string
          in_time: string
          out_time: string
          work_from_home: boolean
          report_division: string
          report_details: string
          report_main_points: string
          report_feedback: string
          report_status: string
          is_holiday: boolean
        }[]
      }
      get_students_reports_for_company_mentor: {
        Args: {
          company_mentor_id: string
          report_date: string
        }
        Returns: {
          student_uid: string
          user_name: string
          company_mentor_uid: string
          company_mentor_name: string
          current_internship_id: string
          internship_start_date: string
          internship_end_date: string
          attendance_id: string
          attendance_status: string
          attendance_date: string
          in_time: string
          out_time: string
          work_from_home: boolean
          report_division: string
          report_details: string
          report_main_points: string
          report_feedback: string
          report_status: string
          is_holiday: boolean
        }[]
      }
      get_total_present_days: {
        Args: {
          student_id: string
          internship_id: string
        }
        Returns: number
      }
      get_total_working_days: {
        Args: {
          start_date: string
          end_date: string
          internship_id: string
          region: string
        }
        Returns: number
      }
      mark_attendance: {
        Args: {
          attendance_id: string
          student_id: string
          internship_id: string
          attendance_date: string
          check_time: string
          work_from_home: boolean
          latitude: number
          longitude: number
          is_check_out: boolean
        }
        Returns: undefined
      }
      update_internship: {
        Args: {
          requesting_user_id: string
          internship_id: string
          role: string
          field: string
          mode: string
          start_date: string
          end_date: string
          company_name: string
          company_address: string
          company_mentor_email?: string
          home_latitude?: number
          home_longitude?: number
          home_radius?: number
          company_latitude?: number
          company_longitude?: number
          company_radius?: number
        }
        Returns: {
          student_id: string
          company_mentor_id: string
          updated: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
