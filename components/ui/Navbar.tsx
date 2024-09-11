import DesktopNav from '@/components/ui/DesktopNav';
import MobileNav from '@/components/ui/MobileNav';
import { Suspense } from 'react';

const Navbar = () => {
  return (
    <Suspense fallback={null}>
      <DesktopNav />
      <MobileNav />
    </Suspense>
  );
};

export default Navbar;
