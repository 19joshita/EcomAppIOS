import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import CartItemView from '../../components/CartItem';

const CartScreen = ({ navigation }: any) => {
  const { cart, totalItems, totalPrice } = useCart();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };
  const { selectedItems, selectedTotalCount, selectedTotalPrice } = useMemo(() => {
    const items = cart.filter(item => selectedIds.includes(item.id));

    return {
      selectedItems: items,
      selectedTotalCount: items.reduce((sum, i) => sum + i.quantity, 0),
      selectedTotalPrice: items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      ),
    };
  }, [cart, selectedIds]);

  const handleCheckout = () => {
    if (!selectedIds.length) {
      Alert.alert('Select at least one item');
      return;
    }

  navigation.navigate('Checkout', {
  items: selectedItems,
  total: selectedTotalPrice,
});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.header}>My Cart</Text>

          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={cart}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => (
            <CartItemView
              item={item}
              selected={selectedIds.includes(item.id)}
              onSelect={() => toggleSelect(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Your cart is empty 🛒</Text>
              <Text style={styles.emptySubtitle}>
                Looks like you haven't added anything yet
              </Text>
            </View>
          }
        />

        {!!cart.length && (
          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.itemsText}>
                {selectedIds.length ? selectedTotalCount : totalItems} Items
              </Text>

              <Text style={styles.totalText}>
                ₹ {selectedIds.length
                  ? selectedTotalPrice.toFixed(2)
                  : totalPrice.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backArrow: {
    fontSize: 26,
    paddingHorizontal: 4,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  },

  /* Empty State */
  emptyBox: {
    alignItems: 'center',
    marginTop: 120,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#777',
  },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    backgroundColor: 'black',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemsText: {
    color: 'white',
    fontSize: 13,
  },

  totalText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },

  checkoutBtn: {
    backgroundColor: 'white',
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 12,
  },

  checkoutText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});