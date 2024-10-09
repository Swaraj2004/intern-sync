import InternshipLetterCell from '@/components/internships/InternshipLetterCell';
import { Card } from '@/components/ui/card';
import { formatDateForDisplay } from '@/lib/utils';

const InternshipDetailsCard = ({
  internshipDetails,
}: {
  internshipDetails: any;
}) => {
  return (
    internshipDetails && (
      <Card className="p-5">
        <div className="grid gap-6 overflow-x-auto">
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Student Name
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.student_name}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">Role</div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.role}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Field
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.field}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">Mode</div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.mode === 'hybrid' ? 'Hybrid' : 'Offline'}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Start Date
            </div>
            <div className="col-span-3 flex items-center">
              {formatDateForDisplay(internshipDetails.start_date)}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              End Date
            </div>
            <div className="col-span-3 flex items-center">
              {formatDateForDisplay(internshipDetails.end_date)}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Internship Letter
            </div>
            <div className="col-span-3 flex items-center">
              <InternshipLetterCell
                internshipLetterUrl={internshipDetails.internship_letter_url}
              />
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Mentor Name
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_mentor_name || '-'}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Mentor Email
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_mentor_email || '-'}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Mentor Designation
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_mentor_designation || '-'}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Name
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_name}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Address
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_address}
            </div>
          </div>
          <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
            <div className="col-span-2 my-auto text-muted-foreground">
              Company Coordinates
            </div>
            <div className="col-span-3 flex items-center">
              {internshipDetails.company_latitude
                ? `${internshipDetails.company_latitude}, ${internshipDetails.company_longitude}`
                : '-'}
            </div>
          </div>
          {internshipDetails.mode === 'hybrid' && (
            <div className="sm:h-10 grid sm:grid-cols-5 sm:space-y-0 space-y-2">
              <div className="col-span-2 my-auto text-muted-foreground">
                Home Coordinates
              </div>
              <div className="col-span-3 flex items-center">
                {internshipDetails.student_home_latitude
                  ? `${internshipDetails.student_home_latitude}, ${internshipDetails.student_home_longitude}`
                  : '-'}
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  );
};

export default InternshipDetailsCard;
