'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './button';

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Image
        src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
        width={20}
        height={20}
        sizes="20x20"
        alt="Loading Theme Toggle"
        priority={false}
        title="Loading Theme Toggle"
        className="mx-2.5"
      />
    );

  if (resolvedTheme === 'dark') {
    return (
      <Button variant="ghost" size="icon" onClick={() => setTheme('light')}>
        <SunIcon className="h-10" />
      </Button>
    );
  }

  if (resolvedTheme === 'light') {
    return (
      <Button variant="ghost" size="icon" onClick={() => setTheme('dark')}>
        <MoonIcon className="h-10 text-slate-600" />
      </Button>
    );
  }
};

export default ThemeToggle;
