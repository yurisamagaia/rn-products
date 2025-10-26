import type { FC } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../theme/colors';

type LoadingStateProps = {
  color?: string;
  size?: 'small' | 'large';
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

export const LoadingState: FC<LoadingStateProps> = ({
  color = colors.price,
  size = 'large',
  containerStyle,
  testID = 'loading-indicator',
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator size={size} color={color} testID={testID} />
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
