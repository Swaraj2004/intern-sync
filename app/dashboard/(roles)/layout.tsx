import Navbar from '@/components/ui/Navbar';

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
      <div className="p-4 w-full max-w-[1250px] mx-auto overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardNav;
