import React, { useEffect, useState, useRef } from 'react'
import { FlatList, StyleSheet, View, Text, ActivityIndicator, Animated, Pressable } from 'react-native'
import { colors } from '../global/colors';
import Search from '../components/Search'
import ProductItem from '../components/ProductItem'
import { useGetProductsByCategoryQuery } from '../services/shopServices';

const ITEM_HEIGHT = 160; 

const ItemListCategory = ({
  navigation,
  route
}) => {
  const [keyWord, setKeyword] = useState("");
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [error, setError] = useState("");
  const { category } = route.params;
  const { data: products, isLoading, error: errorFromFetch } = useGetProductsByCategoryQuery(category);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  useEffect(() => {
    const regex = /\d/;
    const hasDigits = regex.test(keyWord);
    if (hasDigits) {
      setError("No se permiten números");
      setProductsFiltered([]); 
      return;
    }

    if (!isLoading && Array.isArray(products)) {
      const productsFilter = products.filter((product) =>
        product.title.toLocaleLowerCase().includes(keyWord.toLocaleLowerCase())
      );
      setProductsFiltered(productsFilter);
      setError("");
    } else if (!isLoading) {
      setProductsFiltered([]); 
    }
  }, [keyWord, category, products, isLoading]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

 
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal400} />
      </View>
    );
  }


  if (errorFromFetch) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar los productos</Text>
        <Pressable 
          style={({pressed}) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Search
          error={error}
          onSearch={setKeyword}
          goBack={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <Text style={styles.title}>{category}</Text>
      <Search
        error={""}
        onSearch={setKeyword}
        goBack={() => navigation.goBack()}
      />
      <FlatList
        data={productsFiltered}
        renderItem={({ item, index }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50 * (index + 1)]
                  })
                }
              ]
            }}
          >
            <ProductItem 
              product={item} 
              navigation={navigation} 
            />
          </Animated.View>
        )}
        keyExtractor={(producto) => producto.id}
        contentContainerStyle={styles.listContent}
        getItemLayout={getItemLayout}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        initialNumToRender={10}
        ListEmptyComponent={
          <Text style={{ color: colors.platinum, textAlign: 'center', marginTop: 20 }}>
            No hay productos para mostrar.
          </Text>
        }
      />
    </Animated.View>
  );
};

export default ItemListCategory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondo,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.letras2,
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  retryButtonPressed: {
    backgroundColor: colors.white,
  },
  retryButtonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'CourierL',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontFamily: "CourierL",
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
});
