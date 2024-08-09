import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { supabaseServer } from '@/utils/supabase/server';
import Link from 'next/link';

const MainNav = async () => {
  const supabase = supabaseServer();

  const { data: userData } = await supabase.auth.getUser();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-background/50 backdrop-blur-md">
      <div className="px-4 lg:container h-14 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Logo className="h-10 w-10" />
          <div className="hidden min-[400px]:block text-2xl font-bold pl-2 text-primary">
            InternSync
          </div>
        </Link>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {userData.user ? (
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild className="hidden md:block">
                <Link href="/register/institute">Register Institute</Link>
              </Button>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;