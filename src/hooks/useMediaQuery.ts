import { useState, useEffect } from 'react';

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', updateMatches);

    updateMatches();

    return () => mediaQueryList.removeEventListener('change', updateMatches);
  }, [query]);

  return matches;
}

export default useMediaQuery;

