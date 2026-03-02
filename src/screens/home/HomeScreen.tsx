import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { getLoggedInUser, logoutUser } from '../../utils/storage';
import { LogOut } from 'lucide-react-native';
import ImageSlider from '../../components/ImageSlider';
import CategoryCard from '../../components/CategoryCard';

const sliderImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtn0i-BTcWdiyTnoPDkTSIt__A1JfqbkjTiw&s',
  'https://nicepng.com/png/detail/830-8304192_ecommerce-development-bottom-banner-ecommerce-banner-png.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKKUvlkTCLoeczbf3vFPXp1zuOQhx3NF3Kfg&s',
];

const HomeScreen = ({ navigation, setUserState }: any) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      const email = await getLoggedInUser();
      if (!email) setUserState(null);
      else setUserEmail(email);
    };
    fetchUser();

    const fetchCategories = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUserState(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EcomApp</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      {/* Welcome Text */}
      {userEmail && (
        <Text style={styles.welcomeText}>
          Welcome, {userEmail.split('@')[0]}!
        </Text>
      )}

      {/* Image Slider */}
      <ImageSlider images={sliderImages} />

      {/* Categories Header */}
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Product')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        style={{ marginTop: 10 }}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <CategoryCard
            name={item}
            imageUrl={`https://picsum.photos/seed/${item}/100`} // random image per category
            onPress={() =>
              navigation.navigate('CategoryProducts', { category: item })
            }
          />
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1d1d1e' },
  logoutButton: { backgroundColor: '#111112', padding: 10, borderRadius: 10 },
  welcomeText: {
    fontSize: 16,
    marginHorizontal: 20,
    marginVertical: 20,
    color: '#555',
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  categoriesTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAllText: { fontSize: 14, color: '#4e54c8', fontWeight: '600' },
});
