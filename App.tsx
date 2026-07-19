import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Toast } from './src/components/common/Toast';

import { Platform } from 'react-native';

// Initialize the TanStack Query Client for managing server states
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes cache stale time
      refetchOnWindowFocus: false,
    },
  },
});

if (Platform.OS === 'web') {
  // Hide the native browser eye icon for password inputs on Web (Edge/Chrome)
  const style = document.createElement('style');
  style.textContent = `
    input::-ms-reveal,
    input::-ms-clear {
      display: none !important;
    }
  `;
  document.head.append(style);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
