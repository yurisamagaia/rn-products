import type { FC } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { colors } from '../theme/colors';

export const LoadingState: FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primaryText} testID={'loading-indicator'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
