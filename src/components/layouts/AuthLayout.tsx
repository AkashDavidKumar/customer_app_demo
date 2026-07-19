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
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardContainer}>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.xl,
    paddingHorizontal: 20,
    paddingVertical: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
      } as any,
      default: theme.shadows.lg,
    }),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    marginBottom: 32,
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
