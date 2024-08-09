import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

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
    title: 'Efficient Management',
    description:
      'Our platform simplifies the management of students in internships.',
  },
];

export default function Home() {
  return (
    <>
      <div className="py-14 lg:py-0 snap-y snap-mandatory overflow-y-scroll lg:h-screen">
        <div className="px-4 lg:container py-14 md:py-20 lg:py-28 grid md:grid-cols-2 gap-8 snap-start lg:h-screen">
          <div className="flex flex-col justify-center text-center md:text-left">
            <h1 className="text-4xl lg:text-6xl xl:text-7xl leading-snug text-primary font-semibold pb-6">
              InternSync: Academic Activity Monitoring Portal
            </h1>
            <p className="text-lg lg:text-2xl text-slate-800 dark:text-slate-300">
              Your One-Stop Solution for Seamless Communication and Progress
              Tracking of Students in Internships.
            </p>
            <div className="flex md:hidden justify-center pt-8">
              <Button variant="outline" asChild>
                <Link href="/register-college">Get Started</Link>
              </Button>
            </div>
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
              Our mission is to revolutionize the way internships are managed
              during the eighth semester. By providing a streamlined process for
              submitting and reviewing daily reports, our platform keeps
              everyone informed and aligned. We simplify the management of
              students by allowing administrators to efficiently register
              students, assign college mentors, and track intern progress. We
              ensure accuracy and completeness in weekly report analysis,
              reducing manual effort and enhancing productivity.
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
                  Intern Submission
                </h2>
                <p className="sm:text-lg">
                  Interns submit daily reports detailing their work.
                </p>
              </div>
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  Company Mentor Review
                </h2>
                <p className="sm:text-lg">
                  Company mentors review and approve these reports.
                </p>
              </div>
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  College Mentor Feedback
                </h2>
                <p className="sm:text-lg">
                  College mentors provide weekly feedback based on the approved
                  reports.
                </p>
              </div>
              <div>
                <h2 className="text-xl text-primary/90 font-medium pb-1">
                  Analytics Dashboard
                </h2>
                <p className="sm:text-lg">
                  College mentors get a comprehensive overview of intern
                  performance through analytics dashboards.
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
}