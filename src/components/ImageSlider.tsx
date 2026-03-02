import React, { useRef, useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Animated } from 'react-native';

const { width } = Dimensions.get('window');

interface ImageSliderProps {
  images: string[];
  height?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, height = 200 }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= images.length) nextIndex = 0;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const renderItem = ({ item }: any) => (
    <View style={[styles.slide, { height }]}>
      <Image source={{ uri: item }} style={[styles.image, { height }]} />
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotContainer}>
      {images.map((_, index) => {
        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return <Animated.View key={index} style={[styles.dot, { opacity }]} />;
      })}
    </View>
  );

  return (
    <View>
      <FlatList
        data={images}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      {renderDots()}
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  slide: { width, justifyContent: 'center', alignItems: 'center' },
  image: { width: width * 0.9, borderRadius: 15, resizeMode: 'cover' },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1c1c1c', marginHorizontal: 4 },
});