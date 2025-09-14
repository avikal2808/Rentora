'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

export function ThemeShifter() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid rendering mismatch during server-side rendering
    return (
      <div className="flex h-9 w-[74px] items-center justify-center rounded-full border p-1">
        <div className="h-7 w-7" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <div className="relative flex h-9 w-[74px] items-center justify-center rounded-full border p-1">
      <div
        className={cn(
          'absolute h-7 w-7 rounded-full bg-primary transition-transform duration-300 ease-in-out',
          isDark ? 'translate-x-[18px]' : '-translate-x-[18px]'
        )}
      />
      <button
        type="button"
        className="z-10 flex flex-1 items-center justify-center"
        onClick={() => setTheme('light')}
        aria-label="Switch to light theme"
      >
        <Sun
          className={cn(
            'h-5 w-5 transition-colors duration-300',
            !isDark ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        />
      </button>
      <button
        type="button"
        className="z-10 flex flex-1 items-center justify-center"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark theme"
      >
        <Moon
          className={cn(
            'h-5 w-5 transition-colors duration-300',
            isDark ? 'text-primary-foreground' : 'text-muted-foreground'
          )}
        />
      </button>
    </div>
  );
}
