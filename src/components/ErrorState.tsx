import type { FC, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../theme/colors';

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  footer?: ReactNode;
};

export const ErrorState: FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'Unable to complete action. Please try again.',
  actionLabel = 'Try again',
  onActionPress,
  footer,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {onActionPress && (
        <TouchableOpacity style={styles.button} onPress={onActionPress}>
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}

      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.price,
  },
  buttonLabel: {
    color: colors.cardBackground,
    fontWeight: '700',
    fontSize: 14,
  },
});
