import { getRoles } from '@/app/helpers';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import MainNav from '@/components/ui/MainNav';
import { convertDashCaseToTitleCase } from '@/lib/utils';
import { supabaseServer } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type Roles = { id: string; name: string }[];
type UserRoles = { id: string; path: string; title: string }[];

const DashboardRolesPage = async () => {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  const { data: userRolesData, error: userRolesError } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('uid', user.user_metadata.uid);

  if (userRolesError || !userRolesData) return redirect('/error');

  const roleIds = userRolesData.map((role) => role.role_id);

  const { data, error } = await getRoles();
  if (error) return redirect('/error');

  const roles: Roles = data;

  const roleMap = roles.reduce((acc, { name, id }) => {
    if (roleIds.includes(id)) {
      acc[id] = name;
    }
    return acc;
  }, {} as Record<string, string>);

  if (roleIds.length === 1) {
    return redirect(`/dashboard/${roleMap[roleIds[0]]}`);
  }

  const usersRoles: UserRoles = roleIds.map((role_id: string) => {
    return {
      id: role_id,
      path: `/dashboard/${roleMap[role_id]}`,
      title: convertDashCaseToTitleCase(roleMap[role_id]),
    };
  });

  return (
    <div>
      <MainNav />
      <div className="flex justify-center items-center min-h-screen">
        <Card className="p-8 sm:p-10 mx-4 w-fit">
          <div className="text-center text-2xl font-medium">Select Role</div>
          <div className="flex flex-col items-center gap-5 pt-6">
            {usersRoles.map(({ id, path, title }) => (
              <Button
                key={id}
                asChild
                className="px-6 py-3 h-11 rounded-lg w-64 text-lg font-medium dark:text-foreground"
              >
                <Link href={path}>{title}</Link>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardRolesPage;
