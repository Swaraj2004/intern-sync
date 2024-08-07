import MainNav from '@/components/ui/MainNav';

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <MainNav />
      {children}
    </>
  );
};

export default MainLayout;
