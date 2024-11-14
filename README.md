
# InternSync : Internship Activity Monitoring Portal

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Technical Overview](#technical-overview)
- [Installation](#installation)
- [Screenshots](#screenshots)

## Introduction

Internsync is a web platform designed to streamline the management and tracking of internship activities for interns, college mentors, and company mentors during the eighth semester. It replaces traditional Excel-based systems by centralizing the submission and review of daily reports, tracking attendance and allowing interns to submit their internship details, daily reports and mark attendance directly through the platform.

## Key Features

- **Centralized Management**: Streamlines daily report submission process and provides feedback mechanism and attendance monitoring.
- **Hierarchical Access**: Role-based access for interns, college mentors, company mentors, department coordinators and institute coordinator ensures efficient management.
- **Key Modules**:
  - **Users Management**
  - **User Invites Through Email**
  - **Internship Management**
  - **Attendance Management**
  - **Daily Report Submission**
  - **Mentor Assignment**
  - **Internship Approval Letter Generation**

## Technical Overview

InternSync leverages modern web technologies to provide a robust solution:

- **Frontend**: Built using **Next.js** and **TypeScript** for a dynamic user experience.
- **Backend**: Utilizes **Supabase** for real-time capabilities and PostgreSQL for data management.
- **Deployment**: Hosted on **Vercel**, ensuring fast and reliable performance.

| Technology  | Description |
|-------------|-------------|
| Next.js     | React framework for building web applications |
| TypeScript  | Typed JavaScript for better tooling |
| Supabase    | Backend as a Service for real-time capabilities |
| Vercel      | Cloud platform for deploying and scaling Next.js applications |

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Swaraj2004/intern-sync.git
   cd intern-sync
   ```

2. **Install dependencies**:
   For packages installation:

   ```bash
   pnpm install
   ```

3. **Set up Supabase**:

   - Create a Supabase Account :
     - Go to Supabase and sign up for a free account.
     - Create a new project in your dashboard.

   - Add Email Providers (SMTP) :
        In Supabase, go to Authentication > Settings > Email provider and configure your SMTP details.
  
   - Update Email Templates :
     - Customize email templates under Authentication > Templates in Supabase as needed.
     - List of Email templates to change
       - Confirm signup
       - Invite user
       - Reset password  
  
   - Configure URL Settings :
        In Settings > Site URL, add the below url for local development.
     - Site URL
       - <http://localhost:3000>
     - Redirect URLs
       - <http://localhost:3000/set-password>
       - <http://localhost:3000/update-password>
       - <http://localhost:3000/verify-email>
  
   - Add SQL Queries and Functions :
     - In the SQL Editor in Supabase, add the necessary SQL queries for tables creation and functions.
     - Run each script directly in the editor.
     - Note : The Supabase Functions are provided in the repository folder at [supabase/sql](https://github.com/Swaraj2004/intern-sync/tree/main/supabase/sql)

   - Set up Storage Buckets :
     - In Storage, create three buckets with the specified names and MIME types :
       - internship-letters (Private): Supports image/jpeg, image/jpg, image/png, application/pdf.
       - internship-approval-formats (Private): Supports application/vnd.openxmlformats-officedocument.wordprocessingml.document.
       - internship-approval-format-template (Public): Holds a single example-template file.

4. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```
   NEXT_PUBLIC_URL=your_public_site_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SMTP_USER=your_smtp_email
   SMTP_PASSWORD=your_smtp_app_password
   ```

5. **Run the application**:
   To run the project:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) on your browser to see the result.

## Screenshots

![Home Page](https://i.imgur.com/9l8Vh7j.png)
![Register Institute Page](https://i.imgur.com/ZVKaKuD.png)
![Login Role Page](https://i.imgur.com/X2xaj4S.png)
![Login Page](https://i.imgur.com/06yxqM1.png)
![Intitute Home Page](https://i.imgur.com/IxeJcIE.png)
![Profile Page](https://i.imgur.com/njanfPI.png)
![Students Page](https://i.imgur.com/zGv7mnL.png)
![Internships Page](https://i.imgur.com/kAuumj8.png)
![Attendance Page](https://i.imgur.com/qqjGYOa.png)
![Reports Page](https://i.imgur.com/Ko7VG40.png)
![Student Home Page](https://i.imgur.com/QqrezFN.png)
![Student Internships Page](https://i.imgur.com/CGbRpgZ.png)
