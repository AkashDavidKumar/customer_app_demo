import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard } from 'react-native';
import { theme } from '../../theme';

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length, value, onChange, error }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);
  const inputs = useRef<Array<TextInput | null>>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    // slight delay ensures keyboard opens smoothly
    const timer = setTimeout(() => {
      inputs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeText = (text: string, index: number) => {
    // Handle pasting full OTP
    if (text.length > 1) {
      const pasted = text.slice(0, length).replace(/[^0-9]/g, '');
      onChange(pasted);
      if (pasted.length === length) {
        inputs.current[length - 1]?.focus();
        Keyboard.dismiss();
      } else {
        inputs.current[pasted.length]?.focus();
      }
      return;
    }

    const newValue = value.split('');
    newValue[index] = text;
    const nextValue = newValue.join('');
    onChange(nextValue);

    if (text !== '') {
      if (index < length - 1) {
        inputs.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (value[index] === '' && index > 0) {
        inputs.current[index - 1]?.focus();
        const newValue = value.split('');
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    }
  };

  return (
    <View style={styles.container}>
      {Array(length)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputs.current[index] = ref; }}
            style={[
              styles.input,
              focusedIndex === index && styles.inputFocused,
              error && styles.inputError,
            ]}
            maxLength={length}
            keyboardType="number-pad"
            value={value[index] || ''}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            selectTextOnFocus
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: theme.spacing.lg,
  },
  input: {
    width: 56,
    height: 64,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.radius.md,
    backgroundColor: '#F8FAFC', // Slate 50
    fontSize: 24,
    fontWeight: theme.typography.weights.semiBold,
    textAlign: 'center',
    color: theme.colors.text.primaryLight,
  },
  inputFocused: {
    borderColor: theme.colors.primary.brand,
    backgroundColor: '#FFFFFF',
    ...theme.shadows.sm,
  },
  inputError: {
    borderColor: theme.colors.status.error,
  },
});
