import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart, CartItem } from '../context/CartContext';
import AddressModal from '../components/AddressModal';
import { SafeAreaView } from 'react-native-safe-area-context';

const ADDRESS_KEY = 'SAVED_ADDRESSES';
const ORDERS_KEY = 'USER_ORDERS';

const CheckoutScreen = ({ navigation, route }: any) => {
  const { cart, clearCart, removeFromCart } = useCart();

  const selectedItems: CartItem[] = route.params?.items || cart;
  const totalPrice: number = route.params?.total || selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [savedAddresses, setSavedAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const data = await AsyncStorage.getItem(ADDRESS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      setSavedAddresses(parsed);
      if (parsed.length) setSelectedAddress(parsed[0]);
    }
  };

  const saveAddresses = async (addresses: string[]) => {
    await AsyncStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
  };

  const handleSaveAddress = (newAddress: string) => {
    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    setSelectedAddress(newAddress);
    saveAddresses(updated);
    Alert.alert('Success', 'Address added successfully');
  };

  const placeOrder = async () => {
    if (!selectedItems.length) {
      Alert.alert('No items selected', 'Please select items before checkout');
      return;
    }

    if (!selectedAddress) {
      Alert.alert('No Address', 'Please add/select delivery address');
      return;
    }

    const order = {
      id: Date.now().toString(),
      address: selectedAddress,
      items: selectedItems,
      total: totalPrice,
      date: new Date().toISOString(),
    };

    try {
      const storedOrders = await AsyncStorage.getItem(ORDERS_KEY);
      const orders = storedOrders ? JSON.parse(storedOrders) : [];

      orders.push(order);
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      selectedItems.forEach(item => removeFromCart(item.id));
      Alert.alert('Success', 'Order placed successfully 🎉');

      navigation.navigate('MainTabs', {
        screen: 'HomeStack',
        params: { screen: 'Home' },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order');
    }
  };

  const renderAddress = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.addressCard,
        selectedAddress === item && styles.selectedAddress,
      ]}
      onPress={() => setSelectedAddress(item)}
    >
      <Text style={styles.addressText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.itemRow}>
      <Text numberOfLines={1} style={styles.itemTitle}>
        {item.title}
      </Text>
      <Text style={styles.itemPrice}>
        ${item.price.toFixed(2)} × {item.quantity}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <FlatList
            data={savedAddresses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderAddress}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No saved addresses. Please add one.
              </Text>
            }
          />
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addBtnText}>+ Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <FlatList
            data={selectedItems}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
          />
        </View>

        {/* Total + Place Order */}
        <View style={styles.bottom}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
            <Text style={styles.orderBtnText}>Place Order</Text>
          </TouchableOpacity>
        </View>

        {/* Address Modal */}
        <AddressModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveAddress}
        />
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

// --- Styles ---
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  backArrow: { fontSize: 26, paddingHorizontal: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  section: { backgroundColor: 'white', padding: 14, borderRadius: 14, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  addressCard: { padding: 12, backgroundColor: '#f2f2f2', borderRadius: 12, marginBottom: 10 },
  selectedAddress: { backgroundColor: '#dcdcdc' },
  addressText: { fontSize: 14 },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center', marginVertical: 8 },
  addBtn: { marginTop: 8, padding: 12, backgroundColor: 'black', borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: 'white', fontWeight: 'bold' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  itemTitle: { fontSize: 14 },
  itemPrice: { fontSize: 13, fontWeight: 'bold' },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalValue: { fontSize: 18, fontWeight: 'bold' },
  orderBtn: { backgroundColor: 'black', padding: 14, borderRadius: 12, alignItems: 'center' },
  orderBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});