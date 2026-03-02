import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { CartItem, useCart } from '../context/CartContext';

interface Props {
  item: CartItem;
  selected?: boolean;
  onSelect?: () => void;
}

const CartItemView: React.FC<Props> = ({ item, selected = false, onSelect }) => {
  const { increaseQty, decreaseQty, removeFromCart } = useCart();

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onSelect} style={styles.checkbox}>
        <Text style={{ fontSize: 18 }}>{selected ? '☑️' : '⬜️'}</Text>
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.price}>${item.price}</Text>

  
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => decreaseQty(item.id)}
          >
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.qty}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => increaseQty(item.id)}
          >
            <Text style={styles.qtyBtnText}>＋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Remove Button */}
      <TouchableOpacity onPress={() => removeFromCart(item.id)}>
        <Text style={styles.remove}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartItemView;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },

  checkbox: {
    marginRight: 8,
  },

  image: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  price: {
    marginVertical: 6,
    fontSize: 15,
    fontWeight: 'bold',
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtyBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  qty: {
    marginHorizontal: 14,
    fontSize: 16,
    fontWeight: 'bold',
  },

  remove: {
    fontSize: 18,
    color: '#999',
    paddingHorizontal: 6,
  },
});