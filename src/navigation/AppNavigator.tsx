import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { FC } from 'react';
import { StyleSheet } from 'react-native';

import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { ProductListScreen } from '../screens/ProductListScreen';
import { colors } from '../theme/colors';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.cardBackground,
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    shadowOpacity: 0,
    shadowColor: 'transparent',
  },
});

export const AppNavigator: FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: true,
          headerTitleAlign: 'center',
          headerStyle: styles.header,
          headerTitleStyle: { color: colors.primaryText },
        }}
      >
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={{ title: 'Lista de Produtos' }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: 'Detalhes do Produto' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
