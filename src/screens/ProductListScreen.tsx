import { useCallback } from 'react';
import type { FC } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { useProductsQuery, type Product } from '../services/products';
import { RootStackParamList } from '../navigation/types';

type ProductListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductList'
>;

export const ProductListScreen: FC<ProductListScreenProps> = ({ navigation }) => {
  const { data, isLoading, isError, refetch, isRefetching } = useProductsQuery();

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleSelectProduct = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetails', { productId });
    },
    [navigation],
  );

  const renderProduct: ListRenderItem<Product> = useCallback(
    ({ item }) => (
      <ProductCard product={item} onPress={() => handleSelectProduct(item.id)} />
    ),
    [handleSelectProduct],
  );

  const keyExtractor = useCallback((item: Product) => item.id.toString(), []);

  const renderContent = () => {
    if (isLoading) return <LoadingState />;

    if (isError) {
      return (
        <ErrorState
          description="Não foi possível carregar os produtos. Tente novamente."
          onActionPress={() => refetch()}
        />
      );
    }

    return (
      <FlatList
        data={data?.products ?? []}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={renderProduct}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.price}
          />
        }
      />
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 56,
  },
  itemSeparator: {
    height: 16,
  },
});
