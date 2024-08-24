'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Logo from '@/components/ui/Logo';
import NavItems from '@/components/ui/NavItems';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/context/UserContext';
import { convertToTitleCase } from '@/lib/utils';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useState } from 'react';

const Nav = () => {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const role = pathname.split('/')[2];

  return (
    <>
      <nav className="px-3 py-2 h-14 flex items-center gap-3 lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <MenuIcon className="h-8 w-8" />
          </SheetTrigger>
          <SheetContent
            side="left"
            aria-describedby={undefined}
            className="w-[300px] overflow-y-auto flex flex-col"
          >
            <SheetHeader>
              <Link
                href="/"
                onClick={() => setSheetOpen(false)}
                className="flex gap-3 items-center"
              >
                <Logo className="h-8 w-8" />
                <SheetTitle className="text-left text-xl">
                  InternSync
                </SheetTitle>
              </Link>
            </SheetHeader>
            <NavItems
              user={user || null}
              pathname={pathname}
              role={role}
              setSheetOpen={setSheetOpen}
            />
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex gap-3 items-center">
          <Logo className="h-10 w-10" />
          <div className="hidden sm:block text-2xl font-bold text-center">
            InternSync
          </div>
        </Link>
        <div className="ml-auto flex gap-3 items-center">
          {loading ? (
            <div className="h-10 flex flex-col justify-evenly items-end">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <div className="text-right">
              <div className="truncate font-medium">
                {user?.user_metadata.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {user && convertToTitleCase(role)}
              </div>
            </div>
          )}
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <Avatar className="h-10 w-10 text-xl font-semibold">
              <AvatarFallback className="bg-slate-300 dark:bg-slate-500">
                {user?.user_metadata.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </nav>
      <nav className="hidden lg:flex flex-col h-full">
        <div>
          <Link href="/" className="flex items-center gap-3 rounded-md">
            <Logo className="h-10 w-10" />
            <div className="text-2xl font-bold text-center">InternSync</div>
          </Link>
        </div>
        <NavItems user={user || null} pathname={pathname} role={role} />
        <div className="grid grid-cols-4 gap-3 rounded-lg p-3 bg-blue-100 dark:bg-secondary shadow">
          {loading ? (
            <Skeleton className="h-12 w-12 rounded-full" />
          ) : (
            <Avatar className="h-12 w-12 text-xl font-semibold">
              <AvatarFallback className="bg-slate-300 dark:bg-slate-500">
                {user?.user_metadata.name.charAt(0).toUpperCase()}
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
                <div className="text-lg font-bold truncate">
                  {user?.user_metadata.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user && convertToTitleCase(role)}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const Navbar = () => {
  return (
    <Suspense>
      <Nav />
    </Suspense>
  );
};

export default Navbar;
