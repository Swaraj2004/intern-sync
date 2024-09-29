import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { supabaseClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import {
  DotIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Settings2Icon,
  SunMoonIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import path from 'path';
import { useEffect, useState } from 'react';

const NavItems = ({
  user,
  pathname,
  role,
  setSheetOpen,
}: {
  user: User | null;
  pathname: string;
  role: string;
  setSheetOpen?: (open: boolean) => void;
}) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const logout = async () => {
    const supabase = supabaseClient();
    await supabase.auth.signOut();
  };

  const menuitems = [
    {
      path: `/dashboard/${role}`,
      title: 'Home',
      access: [
        'institute-coordinator',
        'department-coordinator',
        'college-mentor',
        'student',
        'company-mentor',
      ],
    },
    {
      path: `/dashboard/${role}/departments`,
      title: 'Departments',
      access: ['institute-coordinator'],
    },
    {
      path: `/dashboard/${role}/college-mentors`,
      title: 'College Mentors',
      access: ['institute-coordinator', 'department-coordinator'],
    },
    {
      path: `/dashboard/${role}/company-mentors`,
      title: 'Company Mentors',
      access: ['department-coordinator', 'college-mentor'],
    },
    {
      path: `/dashboard/${role}/students`,
      title: 'Students',
      access: [
        'institute-coordinator',
        'department-coordinator',
        'college-mentor',
      ],
    },
    {
      path: `/dashboard/${role}/internships`,
      title: 'Internships',
      access: ['department-coordinator', 'college-mentor', 'student'],
    },
    {
      path: `/dashboard/${role}/attendance`,
      title: 'Attendance',
      access: [
        'college-mentor',
        'student',
        'company-mentor',
        'department-coordinator',
      ],
    },
  ];

  return (
    <div className="mt-3 lg:mt-7 lg:mb-4 flex flex-col gap-4 flex-grow overflow-auto">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 text-muted-foreground items-center">
          <LayoutDashboardIcon className="h-5 w-5" />
          <h4 className="text-muted-foreground font-medium">MENU</h4>
        </div>
        <ul className="flex flex-col gap-1">
          {menuitems.map((item) => {
            if (item.access.includes(role)) {
              return (
                <li
                  key={item.path}
                  onClick={() => {
                    if (setSheetOpen) {
                      setSheetOpen(false);
                    }
                  }}
                >
                  <Link
                    href={item.path}
                    className={`flex gap-2 w-full p-2 rounded-lg hover:text-primary ${
                      pathname === item.path && 'text-primary lg:bg-secondary'
                    }`}
                  >
                    <DotIcon strokeWidth={6} />
                    {item.title}
                  </Link>
                </li>
              );
            }
          })}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 text-muted-foreground items-center">
          <Settings2Icon className="h-5 w-5" />
          <h4 className="text-muted-foreground font-medium">OTHER</h4>
        </div>
        <ul className="flex flex-col gap-1">
          <li
            onClick={() => {
              if (setSheetOpen) {
                setSheetOpen(false);
              }
            }}
          >
            <Link
              href={`/dashboard/${role}/profile`}
              className={`flex gap-2 w-full p-2 rounded-lg hover:text-primary ${
                pathname === `/dashboard/${role}/profile` && 'text-primary'
              }`}
            >
              <DotIcon strokeWidth={6} />
              Profile
            </Link>
          </li>
          {user?.user_metadata.role_ids.length > 1 && (
            <li
              onClick={() => {
                if (setSheetOpen) {
                  setSheetOpen(false);
                }
              }}
            >
              <Link
                href={`/dashboard`}
                className={`flex gap-2 w-full p-2 rounded-lg hover:text-primary ${
                  pathname === '/dashboard' && 'text-primary'
                }`}
              >
                <DotIcon strokeWidth={6} />
                Switch role
              </Link>
            </li>
          )}
        </ul>
      </div>
      <hr className="h-0.5 bg-slate-200 lg:bg-muted dark:bg-muted" />
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 text-muted-foreground items-center p-2">
          <SunMoonIcon className="h-5 w-5" />
          <h4 className="font-medium mr-auto">Dark Mode</h4>
          {mounted ? (
            <Switch
              checked={theme === 'dark'}
              onClick={() => {
                setTheme(theme === 'light' ? 'dark' : 'light');
              }}
            />
          ) : (
            <Skeleton className="h-6 w-11 rounded-full" />
          )}
        </div>
        <div className="p-2">
          <button
            onClick={logout}
            className="flex gap-2 text-muted-foreground items-center w-fit hover:text-destructive"
          >
            <LogOutIcon className="h-5 w-5" />
            <h4 className="font-medium">Logout</h4>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavItems;
