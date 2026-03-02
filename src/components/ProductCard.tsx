import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Product } from '../types/Product';

const { width } = Dimensions.get('window');

interface Props {
  item: Product;
  onPress: () => void;
}

const ProductCard: React.FC<Props> = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>

      <Text style={styles.price}>${item.price}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    width: width * 0.44,
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: 'bold',
  },
});