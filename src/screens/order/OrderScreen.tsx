import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const ORDERS_KEY = 'USER_ORDERS';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  address: string;
  items: OrderItem[];
  total: number;
  date: string;
}

const OrderScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await AsyncStorage.getItem(ORDERS_KEY);
      if (data) {
        setOrders(JSON.parse(data).reverse());
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.log('Failed to load orders:', error);
    }
  };

  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: Order }) => {
    const date = new Date(item.date).toLocaleString();
    return (
      <View style={styles.orderCard}>
        <View style={styles.headerRow}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.total}>Total: ${item.total.toFixed(2)}</Text>
        </View>

        <Text style={styles.address}>Deliver to: {item.address}</Text>
        <TouchableOpacity style={styles.viewDetailsBtn} onPress={() => openModal(item)}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>My Orders</Text>

        {orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No orders found 🛒</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Order Details Modal */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Order Details</Text>
              <ScrollView>
                {selectedOrder?.items.map((prod) => (
                  <View key={prod.id} style={styles.modalItemRow}>
                    <Image
                      source={{ uri: prod.image || 'https://via.placeholder.com/60' }}
                      style={styles.modalItemImage}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text numberOfLines={1} style={styles.modalItemTitle}>{prod.title}</Text>
                      <Text style={styles.modalItemQty}>${prod.price.toFixed(2)} × {prod.quantity}</Text>
                    </View>
                  </View>
                ))}

                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalText}>Total:</Text>
                  <Text style={styles.modalTotalValue}>${selectedOrder?.total.toFixed(2)}</Text>
                </View>

                <Text style={styles.modalAddress}>Deliver to: {selectedOrder?.address}</Text>
              </ScrollView>

              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },

  orderCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
  },
  imagesRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 8,
  },
  viewDetailsBtn: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#000',
  },
  viewDetailsText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  modalItemRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  modalItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  modalItemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalItemQty: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  modalTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalAddress: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
  },
  closeBtn: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});