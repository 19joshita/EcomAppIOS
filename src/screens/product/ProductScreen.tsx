import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../types/Product';

const LIMIT = 10;

const ProductScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    fetchProducts(skip);
  }, [skip]);

  const fetchProducts = async (currentSkip: number) => {
    if (loading || allLoaded) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://fakestoreapi.com/products?limit=${LIMIT}&skip=${currentSkip}`
      );

      const data: Product[] = await res.json();

      if (data.length < LIMIT) {
        setAllLoaded(true); // No more products
      }

      if (currentSkip === 0) setProducts(data);
      else setProducts(prev => [...prev, ...data]);

    } catch (err) {
      console.log('API ERROR', err);
    }

    setLoading(false);
  };

  const loadMore = () => {
    if (!loading && !allLoaded) {
      setSkip(prev => prev + LIMIT);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setAllLoaded(false);
    setSkip(0);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Products</Text>
    </View>

      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => navigation.navigate('ProductDetail', { item })}
          />
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 50,
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

back: {
  fontSize: 22,
  marginRight: 10,
},

headerTitle: {
  fontSize: 22,
  fontWeight: 'bold',
},
});