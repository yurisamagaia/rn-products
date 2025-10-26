import type { FC } from 'react';
import { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useProductQuery } from '../services/products';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { formatCurrency } from '../utils/formatCurrency';

type ProductDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetails'
>;

export const ProductDetailsScreen: FC<ProductDetailsScreenProps> = ({
  route,
}) => {
  const { productId } = route.params;
  const { data, isLoading, isError, refetch } = useProductQuery(productId);

  const heroImage = useMemo(() => {
    if (!data) {
      return undefined;
    }

    return data.images?.[0] ?? data.thumbnail;
  }, [data]);

  if (isLoading) return <LoadingState />

  if (isError || !data) {
    return (
      <ErrorState
        title="Não foi possível carregar o produto."
        description="Verifique sua conexão e tente novamente mais tarde."
        onActionPress={() => refetch()}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
    >
      {heroImage && (
        <View style={styles.heroWrapper}>
          <Image source={{ uri: heroImage }} style={styles.heroImage} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.brand}>{data.brand}</Text>
        <Text style={styles.title}>{data.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.price}>{formatCurrency(data.price)}</Text>
          {data.discountPercentage > 0 ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {`${data.discountPercentage.toFixed(2)}% OFF`}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.subMetaRow}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color={colors.accent} />
            <Text style={styles.rating}>{data.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.stock}>{`${data.stock} unidades disponíveis`}</Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.description}>{data.description}</Text>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Categoria</Text>
        <Text style={styles.sectionValue}>{data.category}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cardBackground,
  },
  content: {
    paddingBottom: 52,
  },
  heroWrapper: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 1,
    height: undefined,
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryText,
  },
  brand: {
    fontSize: 16,
    color: colors.secondaryText,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  subMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.price,
  },
  discountBadge: {
    backgroundColor: colors.discount,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  discountText: {
    color: colors.cardBackground,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.accent,
  },
  stock: {
    fontSize: 14,
    color: colors.subtleText,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.secondaryText,
  },
  sectionValue: {
    fontSize: 16,
    color: colors.secondaryText,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.cardBackground,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
});
