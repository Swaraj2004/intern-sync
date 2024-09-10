'use client';

import { Badge } from '@/components/ui/badge';

type UserStatusProps = {
  isRegistered: boolean;
  isVerified: boolean;
};

const UserStatus: React.FC<UserStatusProps> = ({
  isRegistered,
  isVerified,
}) => {
  return (
    <div className="flex items-center">
      {isRegistered && isVerified && (
        <Badge className="bg-green-500 hover:bg-green-600 dark:bg-green-300 dark:hover:bg-green-400">
          Verified
        </Badge>
      )}
      {isRegistered && !isVerified && (
        <Badge className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-200 dark:hover:bg-yellow-300">
          Unverified
        </Badge>
      )}
      {!isRegistered && (
        <Badge className="bg-red-500 hover:bg-red-600 dark:bg-red-300 dark:hover:bg-red-400">
          Unregistered
        </Badge>
      )}
    </div>
  );
};

export default UserStatus;
