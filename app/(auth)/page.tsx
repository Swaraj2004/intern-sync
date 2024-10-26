import GetStartedButton from '@/app/(auth)/GetStartedButton';
import Image from 'next/image';

const features = [
  {
    title: 'Daily Report Submission',
    description: 'Students can submit daily reports to their college mentors.',
  },
  {
    title: 'Report Analysis',
    description: 'College mentors can review and provide feedbacks to reports.',
  },
  {
    title: 'Intern Progress Tracking',
    description:
      'College mentors can track the progress of students in internships.',
  },
  {
    title: 'Company Mentor Approval',
    description:
      'Company mentors can approve the daily reports submitted by students.',
  },
  {
    title: 'College Mentor Assignment',
    description: 'Administrators can assign college mentors to students.',
  },
  {
    title: 'Attendance Tracking',
    description:
      'Interns can quickly mark attendance, and mentors can easily approve it.',
  },
];

const HomePage = () => {
  return (
    <>
      <div className="py-14 lg:py-0 snap-y snap-mandatory overflow-y-scroll lg:h-screen">
        <div className="px-4 lg:container py-14 md:py-20 lg:py-28 grid md:grid-cols-2 gap-8 snap-start lg:h-screen">
          <div className="flex flex-col justify-center text-center md:text-left">
            <div>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl leading-snug text-primary font-semibold pb-5">
                InternSync
              </h1>
              <h1 className="text-3xl lg:text-3xl xl:text-4xl leading-snug text-gray-700 dark:text-slate-100 font-semibold pb-6">
                Internship Activity Monitoring Portal
              </h1>
            </div>
            <p className="text-lg lg:text-2xl text-slate-800 dark:text-slate-300">
              Your One-Stop Solution for Seamless Communication and Progress
              Tracking of Students in Internships.
            </p>
            <GetStartedButton />
          </div>
          <div className="hidden md:grid">
            <Image
              src="/college-students.svg"
              width={500}
              height={500}
              alt="College Students"
              className="h-[350px] lg:h-[500px] w-auto my-auto ml-auto"
            />
          </div>
        </div>
        <div className="px-4 lg:container py-14 md:py-20 lg:py-28 grid md:grid-cols-2 gap-8 snap-start lg:h-screen">
          <div className="grid">
            <Image
              src="/site-stats.svg"
              width={500}
              height={500}
              alt="Management"
              className="h-fit md:h-[500px] sm:w-3/4 md:w-auto m-auto md:mx-0"
            />
          </div>
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary font-semibold pb-6">
              About Our Platform
            </h1>
            <p className="text-lg lg:text-xl text-slate-800 dark:text-slate-300">
              Internsync transforms internship management in the eighth semester
              with an intuitive platform tailored for institutions, mentors, and
              interns. Eliminating spreadsheets and scattered workflows, it
              centralizes daily attendance and reports, performance tracking,
              and feedback. Internsync empowers interns to monitor their
              progress while enabling mentors to guide effectively through
              dynamic dashboards and tables. With mobile access and key modules
              like Attendance, Report Management, and Mentor Assignments,
              Internsync creates an organized, efficient, and impactful
              internship experience for all.
            </p>
          </div>
        </div>
        <div className="px-4 lg:container py-14 md:py-20 lg:py-28 snap-start lg:h-screen lg:flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary text-center font-semibold pb-6 md:pb-10">
            Key Features
          </h1>
          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-8 xl:p-12 rounded-xl border-2 bg-card text-card-foreground shadow-sm hover:-translate-y-2 ease-in-out duration-300 hover:border-primary"
              >
                <h2 className="text-xl md:text-2xl text-primary text-center font-semibold pb-4">
                  {feature.title}
                </h2>
                <p className="text-lg md:text-xl text-center text-slate-800 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative px-4 lg:container py-14 md:py-20 lg:py-28 grid md:grid-cols-2 gap-8 snap-start lg:h-screen">
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-primary font-semibold pb-6">
              How it works
            </h1>
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  Submission by Interns
                </h2>
                <p className="sm:text-lg">
                  Interns mark attendance and submit daily reports detailing
                  their work.
                </p>
              </div>
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  Mentor Approval
                </h2>
                <p className="sm:text-lg">
                  Either a college mentor or a company mentor can approve
                  attendance and reports.
                </p>
              </div>
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  Mentor Feedback
                </h2>
                <p className="sm:text-lg">
                  Feedback is provided for each report, with an option for
                  revisions if necessary.
                </p>
              </div>
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  Performance Overview
                </h2>
                <p className="sm:text-lg">
                  Mentors can view a detailed overview of intern performance
                  presented in organized tables.
                </p>
              </div>
            </div>
          </div>
          <div className="grid row-start-1 md:row-auto">
            <Image
              src="/timeline.svg"
              width={500}
              height={500}
              alt="Timeline"
              className="h-fit md:h-[500px] sm:w-3/4 md:w-auto m-auto md:mr-0"
            />
          </div>
          <footer className="absolute -bottom-14 lg:bottom-0 left-0 right-0 px-4 lg:container text-slate-800 dark:text-slate-300 py-3">
            <p className="text-center">
              &copy; 2024 InternSync. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;
