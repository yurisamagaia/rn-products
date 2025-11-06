import { memo, useCallback, useMemo, useState } from 'react';
import type { FC } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  TextInput,
  Text,
  type ListRenderItem,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ProductCard } from '../components/ProductCard';
import { colors } from '../theme/colors';
import { useProductsQuery, type Product } from '../services/products';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type ProductListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductList'
>;

const Separator = memo(() => <View style={styles.itemSeparator} />);

export const ProductListScreen: FC<ProductListScreenProps> = ({ navigation }) => {
  const { data, isLoading, isError, refetch, isRefetching } = useProductsQuery();
  const [query, setQuery] = useState('');

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

  const filteredProducts = useMemo(() => {
    const list = data?.products ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(p =>
      `${p.title} ${p.brand ?? ''} ${p.category ?? ''}`.toLowerCase().includes(q),
    );
  }, [data?.products, query]);

  const renderContent = () => {
    if (isLoading) return <LoadingState />;

    if (isError) {
      return (
        <ErrorState
          description="Unable to load products. Please try again."
          onActionPress={handleRefresh}
        />
      );
    }

    return (
      <>
        <View style={styles.searchWrapper}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search by nome, brand or category..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>

        <FlatList
          data={filteredProducts}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={Separator}
          renderItem={renderProduct}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No results</Text>
              <Text style={styles.emptySubtitle}>Try another search term</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.price}
            />
          }
          keyboardShouldPersistTaps="handled"
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 6,
  },
  searchInput: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  listContent: {
    padding: 16,
    paddingBottom: 56,
  },
  itemSeparator: {
    height: 16,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#6B7280',
  },
});
