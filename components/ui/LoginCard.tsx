import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/ui/Logo';
import Image from 'next/image';
import Link from 'next/link';

interface LoginCardProps {
  loginType: string;
  children: React.ReactNode;
}

const LoginCard = ({ loginType, children }: LoginCardProps) => {
  return (
    <Card className="max-w-3xl p-8 mx-4 md:p-12 md:w-full">
      <div className="grid md:grid-cols-2 gap-14">
        <div className="hidden md:grid">
          <Image
            src="/login-asset.svg"
            alt="Login"
            width={500}
            height={500}
            className="m-auto"
          />
        </div>
        <div>
          <CardHeader className="text-center p-0 pb-5">
            <Link href="/" className="flex items-center pb-2">
              <Logo className="mx-auto" />
            </Link>
            <CardTitle className="leading-8">{loginType}</CardTitle>
            <CardDescription>Login to access your account.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">{children}</CardContent>
        </div>
      </div>
    </Card>
  );
};

export default LoginCard;
