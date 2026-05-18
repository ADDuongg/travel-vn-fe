import { useEffect, useState } from 'react';

export function useMinLoading(isLoading: boolean, delay = 200) {
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      return;
    }

    const t = setTimeout(() => setVisible(false), delay);
    return () => clearTimeout(t);
  }, [isLoading, delay]);

  return visible;
}

