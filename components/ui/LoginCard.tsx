import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/ui/Logo';

interface LoginCardProps {
  loginType: string;
  children: React.ReactNode;
}

const LoginCard = ({ loginType, children }: LoginCardProps) => {
  return (
    <Card className="max-w-xs w-full">
      <CardHeader className="text-center">
        <Logo className="mx-auto pb-1" />
        <CardTitle>{loginType}</CardTitle>
        <CardDescription>Login to access your account.</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default LoginCard;
