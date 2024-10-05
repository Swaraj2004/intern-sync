'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Logo from '@/components/ui/Logo';
import NavItems from '@/components/ui/NavItems';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { convertToTitleCase } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DesktopNav = () => {
  const { user, loading } = useUser();
  const pathname = usePathname();

  const role = pathname.split('/')[2];

  return (
    <nav className="hidden lg:flex flex-col h-full">
      <div>
        <Link href="/" className="flex items-center gap-3 rounded-md">
          <Logo className="h-10 w-10" />
          <div className="text-2xl font-bold text-center">InternSync</div>
        </Link>
      </div>
      <NavItems pathname={pathname} role={role} />
      <div className="grid grid-cols-4 gap-3 rounded-lg p-3 bg-blue-100 dark:bg-secondary shadow">
        {loading ? (
          <Skeleton className="h-12 w-12 rounded-full" />
        ) : (
          <Avatar className="h-12 w-12 text-xl font-semibold">
            <AvatarFallback className="bg-slate-300 dark:bg-slate-500">
              {user && user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex flex-col justify-evenly text-left w-full col-span-3">
          {loading ? (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </>
          ) : (
            <>
              <div className="text-lg font-bold truncate">{user?.name}</div>
              <div className="text-sm text-muted-foreground">
                {user && convertToTitleCase(role)}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DesktopNav;
