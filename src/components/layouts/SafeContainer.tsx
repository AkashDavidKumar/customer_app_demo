import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../../theme';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[];
  themeMode?: 'light' | 'dark';
}

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  themeMode = 'light',
}) => {
  const isDark = themeMode === 'dark';
  const backgroundColor = isDark ? theme.colors.background.dark : theme.colors.background.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]} edges={edges}>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
