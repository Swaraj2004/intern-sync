import Navbar from '@/components/ui/Navbar';
import { RolesProvider } from '@/context/RolesContext';

const DashboardNav = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="lg:flex">
      <div className="h-14 lg:h-screen bg-card lg:p-4 lg:w-2/5 xl:w-[30%] lg:max-w-72 lg:overflow-auto shadow-md">
        <Navbar />
      </div>
      <RolesProvider>
        <div className="p-4 lg:px-8 lg:py-6 w-full max-w-[1250px] mx-auto overflow-auto">
          {children}
        </div>
      </RolesProvider>
    </div>
  );
};

export default DashboardNav;
