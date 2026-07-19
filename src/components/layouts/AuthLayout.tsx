import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeContainer } from './SafeContainer';
import { theme } from '../../theme';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  logo?: boolean; // Can be expanded to take an actual logo component
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, logo }) => {
  return (
    <SafeContainer style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {logo && (
            <View style={styles.logoContainer}>
              <View style={styles.placeholderLogo}>
                <Text style={styles.logoText}>C</Text>
              </View>
            </View>
          )}

          <View style={styles.headerContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          <View style={styles.formContainer}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  placeholderLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary.brand,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerContainer: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.sizes.xxxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primaryLight,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondaryLight,
  },
  formContainer: {
    width: '100%',
  },
});
