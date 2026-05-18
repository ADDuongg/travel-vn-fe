import { useEffect, useState } from 'react';

export function useCountdown(expireAt?: Date) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!expireAt) return;

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id);
  }, [expireAt]);

  if (!expireAt) return null;

  const diff = expireAt.getTime() - now;
  if (diff <= 0) return null;

  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

