import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// 支持静态渲染，需要在客户端重新计算web的值
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
