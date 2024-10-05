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
import { useState } from 'react';

const MobileNav = () => {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const role = pathname.split('/')[2];

  return (
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
              <SheetTitle className="text-left text-xl">InternSync</SheetTitle>
            </Link>
          </SheetHeader>
          <NavItems
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
            <div className="truncate font-medium">{user?.name}</div>
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
              {user && user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </nav>
  );
};

export default MobileNav;
