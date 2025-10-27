import type { FC } from 'react';
import { useMemo, useState, useCallback } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Dimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  type ImageLoadEventData,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useProductQuery } from '../services/products';
import { colors } from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { formatCurrency } from '../utils/formatCurrency';
import { ReviewsModal } from '../components/ReviewsModal';

type ProductDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetails'
>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductDetailsScreen: FC<ProductDetailsScreenProps> = ({ route }) => {
  const { productId } = route.params;
  const { data, isLoading, isError, refetch } = useProductQuery(productId);

  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageHeights, setImageHeights] = useState<Record<string, number>>({});
  const [infoOpen, setInfoOpen] = useState(false);

  const images = useMemo(() => {
    if (!data) return [];
    const list = data.images && data.images.length > 0 ? data.images : [data.thumbnail];
    return list.filter(Boolean) as string[];
  }, [data]);

  const availability = useMemo(() => {
    if (!data) return { label: '', inStock: false, lowStock: false };
    const inStock = data.availabilityStatus === 'In Stock' && data.stock > 0;
    const lowStock = inStock && data.stock < 10;
    const label = inStock ? (lowStock ? 'Few units' : 'In stock') : 'Unavailable';
    return { label, inStock, lowStock };
  }, [data]);

  const onImageLoad = useCallback(
    (uri: string) => (e: NativeSyntheticEvent<ImageLoadEventData>) => {
      const { width, height } = (e.nativeEvent as any).source || {};
      if (width && height && !imageHeights[uri]) {
        const h = (SCREEN_WIDTH * height) / width;
        setImageHeights(prev => ({ ...prev, [uri]: h }));
      }
    },
    [imageHeights]
  );

  const handleMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const idx = Math.round(contentOffset.x / layoutMeasurement.width);
    setCurrentIdx(idx);
  }, []);

  if (isLoading) return <LoadingState />;

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to load product."
        description="Please check your connection and try again later."
        onActionPress={() => refetch()}
      />
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
      >
        {images.length > 0 && (
          <View style={styles.heroWrapper}>
            <FlatList
              data={images}
              keyExtractor={(uri, idx) => `${idx}-${uri}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleMomentumEnd}
              renderItem={({ item: uri }) => {
                const dynamicHeight = imageHeights[uri] ?? SCREEN_WIDTH * 0.75;
                return (
                  <View style={{ width: SCREEN_WIDTH }}>
                    <Image
                      source={{ uri }}
                      onLoad={onImageLoad(uri)}
                      style={{ width: SCREEN_WIDTH, height: dynamicHeight }}
                      resizeMode="cover"
                    />
                  </View>
                );
              }}
            />
            {images.length > 1 && (
              <View style={styles.dots}>
                {images.map((_, i) => (
                  <View key={i} style={[styles.dot, i === currentIdx && styles.dotActive]} />
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.brand}>{data.brand}</Text>
          <Text style={styles.title}>{data.title}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.price}>{formatCurrency(data.price)}</Text>
            {data.discountPercentage > 0 ? (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{`${data.discountPercentage.toFixed(2)}% OFF`}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.subMetaRow}>
            <Pressable
              onPress={() => setReviewsOpen(true)}
              style={styles.ratingContainer}
              android_ripple={{ color: '#e5e7eb', borderless: true }}
            >
              <MaterialIcons name="star" size={20} color={colors.accent} />
              <Text style={styles.rating}>{data.rating.toFixed(1)}</Text>
            </Pressable>

            <View style={styles.rightMeta}>
              <Text style={styles.stock}>{`${data.stock} available units`}</Text>
              <View
                style={[
                  styles.availabilityBadge,
                  availability.inStock
                    ? (availability.lowStock ? styles.availabilityLow : styles.availabilityOk)
                    : styles.availabilityOff,
                ]}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    !availability.inStock && { color: '#991B1B' },
                  ]}
                >
                  {availability.label}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          {!!data.tags?.length && (
            <>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagsWrap}>
                {data.tags.map(tag => (
                  <Text key={tag} style={styles.tagChip}>
                    {tag}
                  </Text>
                ))}
              </View>
              <View style={styles.separator} />
            </>
          )}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{data.description}</Text>

          <View style={styles.separator} />

          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.sectionValue}>{data.category}</Text>

          <View style={styles.separator} />

          {(data.dimensions || data.weight) && (
            <>
              <Text style={styles.sectionTitle}>Specifications</Text>
              <View style={styles.specs}>
                {data.dimensions && (
                  <>
                    <SpecItem label="Width" value={`${data.dimensions.width}`} unit="cm" />
                    <SpecItem label="Height" value={`${data.dimensions.height}`} unit="cm" />
                    <SpecItem label="Depth" value={`${data.dimensions.depth}`} unit="cm" />
                  </>
                )}
                {typeof data.weight === 'number' && (
                  <SpecItem label="Weight" value={`${data.weight}`} unit="kg" />
                )}
              </View>
              <View style={styles.separator} />
            </>
          )}

          {(data.warrantyInformation || data.shippingInformation) && (
            <View>
              <Pressable
                onPress={() => setInfoOpen(v => !v)}
                style={styles.collapseHeader}
                android_ripple={{ color: '#e5e7eb' }}
              >
                <Text style={styles.sectionTitle}>Warranty and Shipping</Text>
                <MaterialIcons
                  name={infoOpen ? 'expand-less' : 'expand-more'}
                  size={22}
                  color={colors.primaryText}
                />
              </Pressable>

              {infoOpen && (
                <View style={{ gap: 8, marginTop: 4 }}>
                  {data.warrantyInformation && (
                    <>
                      <Text style={styles.subLabel}>Guarantee</Text>
                      <Text style={styles.description}>{data.warrantyInformation}</Text>
                    </>
                  )}
                  {data.shippingInformation && (
                    <>
                      <Text style={styles.subLabel}>Shipping</Text>
                      <Text style={styles.description}>{data.shippingInformation}</Text>
                    </>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <ReviewsModal
        visible={reviewsOpen}
        onClose={() => setReviewsOpen(false)}
        reviews={data.reviews ?? []}
        title={data.title}
      />
    </>
  );
};

const SpecItem: FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
  <View style={styles.specRow}>
    <Text style={styles.specLabel}>{label}</Text>
    <Text style={styles.specValue}>
      {value}
      {unit ? ` ${unit}` : ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cardBackground },
  content: { paddingBottom: 52 },

  heroWrapper: { marginHorizontal: 0, backgroundColor: colors.cardBackground },
  dots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.background },
  dotActive: { backgroundColor: colors.accent },

  infoContainer: { paddingHorizontal: 20, paddingTop: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: '700', color: colors.primaryText },
  brand: { fontSize: 16, color: colors.secondaryText },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  subMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    gap: 8,
  },
  rightMeta: { alignItems: 'flex-end', gap: 6 },

  price: { fontSize: 22, fontWeight: '700', color: colors.price },
  discountBadge: {
    backgroundColor: colors.discount,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  discountText: { color: colors.cardBackground, fontWeight: '700', fontSize: 12, letterSpacing: 0.2 },

  availabilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  availabilityOk: { backgroundColor: '#DCFCE7' },
  availabilityLow: { backgroundColor: '#FEF9C3' },
  availabilityOff: { backgroundColor: '#FEE2E2' },
  availabilityText: { color: '#065F46', fontWeight: '600', fontSize: 12 },

  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rating: { fontSize: 16, fontWeight: '600', color: colors.accent },
  stock: { fontSize: 14, color: colors.subtleText, fontWeight: '500' },

  separator: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  
  collapseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.primaryText },
  subLabel: { fontSize: 14, fontWeight: '600', color: colors.primaryText, marginTop: 4 },
  description: { fontSize: 16, lineHeight: 22, color: colors.secondaryText },
  sectionValue: { fontSize: 16, color: colors.secondaryText, fontWeight: '500', textTransform: 'capitalize' },

  specs: { marginTop: 4 },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  specLabel: { color: colors.secondaryText },
  specValue: { color: colors.primaryText, fontWeight: '600' },
});
