import type { FC } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/formatCurrency';
import type { Product } from '../services/products';

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
};

export const ProductCard: FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.9}
        style={styles.container}
        onPress={onPress}
      >
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            <View style={styles.ratingContainer}>
              <MaterialIcons name="star" size={16} color={colors.accent} />
              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  container: {
    borderRadius: 16,
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.price,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
});
