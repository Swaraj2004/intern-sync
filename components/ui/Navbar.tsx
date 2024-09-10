'use client';

import DesktopNav from '@/components/ui/DesktopNav';
import MobileNav from '@/components/ui/MobileNav';
import { Suspense, useEffect, useState } from 'react';

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </Suspense>
  );
};

export default Navbar;
