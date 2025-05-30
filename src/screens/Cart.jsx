import { FlatList, StyleSheet, Text, View, ActivityIndicator, Animated, Pressable, Alert } from "react-native";
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../components/CartItem";
import { colors } from "../global/colors";
import { clearCart } from "../features/Cart/cartSlice";
import { usePostOrderMutation } from '../services/shopServices';
import { useNavigation } from '@react-navigation/native';

const ITEM_HEIGHT = 120;

const CartScreen = () => {
  const { items: cartItems, total } = useSelector((state) => state.cart.value);
  const { localId } = useSelector(state => state.auth.value);
  const [triggerPostOrder, result] = usePostOrderMutation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const handleCheckout = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
    
    try {
      await triggerPostOrder({
        items: cartItems,
        user: localId,
        total,
        createdAt: new Date().toISOString(),
      }).unwrap(); 
      dispatch(clearCart());
      Alert.alert("Compra Exitosa", "Tu pedido ha sido realizado correctamente y tu carrito ha sido vaciado.");
      navigation.navigate('Orders');
    } catch (error) {
      Alert.alert("Error en la Compra", "Hubo un problema al procesar tu orden. Por favor, intenta de nuevo.");
    }
  };

  const handleClearCart = () => {
    if (cartItems && cartItems.length > 0) {
      dispatch(clearCart());
      Alert.alert("Carrito Vacío", "Todos los productos han sido eliminados del carrito.");
    } else {
      Alert.alert("Carrito Vacío", "El carrito ya está vacío.");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Animated.View style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
        <Pressable 
          style={({pressed}) => [
            styles.shopButton,
            pressed && styles.shopButtonPressed
          ]}
          onPress={() => navigation.navigate("HomeScreemNavigator", { screen: "Home" })}
        >
          <Text style={styles.shopButtonText}>Ir a comprar</Text>
        </Pressable>
      </Animated.View>
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
      <Text style={styles.title}>Carrito</Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
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
            <CartItem cartItem={item} />
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        getItemLayout={getItemLayout}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true} 
        initialNumToRender={10}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
        <View style={styles.buttonContainer}>
          <Pressable 
            style={({pressed}) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed
            ]}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Vaciar carrito</Text>
          </Pressable>
          <Pressable 
            style={({pressed}) => [
              styles.checkoutButton,
              pressed && styles.checkoutButtonPressed
            ]}
            onPress={handleCheckout}
            disabled={result.isLoading} 
          >
            {result.isLoading ? (
              <ActivityIndicator color={colors.teal900} />
            ) : (
              <Text style={styles.checkoutButtonText}>Finalizar compra</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondo,
    padding: 20,
  },
  emptyText: {
    color: colors.platinum,
    fontSize: 24,
    fontFamily: 'CourierL',
    marginBottom: 20,
    textAlign: 'center',
  },
  shopButton: {
    backgroundColor: colors.teal400,
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  shopButtonPressed: {
    backgroundColor: colors.teal200,
  },
  shopButtonText: {
    color: colors.letras,
    fontSize: 16,
    fontFamily: 'CourierL',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontFamily: "CourierL",
    color: colors.platinum,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.teal600,
  },
  total: {
    fontSize: 24,
    fontFamily: 'CourierL',
    color: colors.platinum,
    textAlign: 'right',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: colors.error,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonPressed: {
    backgroundColor: colors.error + '80', 
  },
  clearButtonText: {
    color: colors.platinum,
    fontSize: 16,
    fontFamily: 'CourierL',
    fontWeight: 'bold',
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonPressed: {
    backgroundColor: colors.teal200,
  },
  checkoutButtonText: {
    color: colors.teal900,
    fontSize: 16,
    fontFamily: 'CourierL',
    fontWeight: 'bold',
  },
});