import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Product } from '../../types/Product';
import { useCart } from '../../context/CartContext';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }: any) => {

  const { addToCart } = useCart();
  const item: Product = route.params.item;
  const handleAddToCart = () => {
    addToCart(item);

    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${item.title}`,
      position: 'top',
    });
  };
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price}</Text>

      <Text style={styles.category}>{item.category}</Text>

      <Text style={styles.description}>{item.description}</Text>

      <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
        <Text style={styles.buttonText}>Add To Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    paddingTop: 50,
  },
  back: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: width * 0.8,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  category: {
    color: 'gray',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  button: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});