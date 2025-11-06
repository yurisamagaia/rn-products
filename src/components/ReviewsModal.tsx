import React, { memo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  type ListRenderItem,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Review } from '../services';

type Props = {
  visible: boolean;
  onClose: () => void;
  reviews: Review[];
  title?: string;
};

const ReviewItem: ListRenderItem<Review> = ({ item }) => (
  <View style={styles.item}>
    <View style={styles.itemHeader}>
      <View style={styles.stars}>
        <MaterialIcons name="star" size={16} color={colors.accent} />
        <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.reviewer}>{item.reviewerName}</Text>
    </View>
    <Text style={styles.comment}>{item.comment}</Text>
  </View>
);

export const ReviewsModal = memo(({ visible, onClose, reviews, title }: Props) => {
  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text numberOfLines={1} style={styles.sheetTitle}>
            Reviews {title ? `· ${title}` : ''}
          </Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <MaterialIcons name="close" size={22} color={colors.primaryText} />
          </Pressable>
        </View>

        <FlatList
          data={reviews}
          keyExtractor={(_, idx) => String(idx)}
          renderItem={ReviewItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 16 }}
          ListEmptyComponent={<Text style={styles.empty}>No reviews yet.</Text>}
        />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    maxHeight: '70%',
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryText,
  },
  item: {
    paddingVertical: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontWeight: '600',
    color: colors.accent,
  },
  reviewer: {
    color: colors.secondaryText,
  },
  comment: {
    color: colors.primaryText,
  },
  separator: {
    height: 12,
  },
  empty: {
    alignSelf: 'center',
    color: colors.secondaryText,
    paddingVertical: 24,
  },
});
