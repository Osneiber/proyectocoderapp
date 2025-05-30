import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  Pressable,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { useGetOrdersQuery } from "../services/shopServices";
import OrderItem from "../components/OrderItem";
import { colors } from "../global/colors";

const Orders = ({ navigation }) => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
      }),
    ]).start();
  }, []);

  const keyExtractor = (item, index) => `order-${item.id || index}`;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.teal400} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error al cargar las órdenes</Text>
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Animated.View
        style={[
          styles.emptyContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.emptyText}>No tienes órdenes</Text>
        <Pressable
          style={({ pressed }) => [
            styles.shopButton,
            pressed && styles.shopButtonPressed,
          ]}
          onPress={() =>
            navigation.navigate("HomeScreemNavigator", { screen: "Home" })
          }
        >
          <Text style={styles.shopButtonText}>Ir a comprar</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.title}>Mis Órdenes</Text>
      <FlatList
        data={orders}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <Animated.View
            key={keyExtractor(item, index)}
            style={{
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 50 * (index + 1)],
                  }),
                },
              ],
            }}
          >
            <OrderItem order={item} navigation={navigation} />
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
    </Animated.View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.teal900,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.teal900,
    padding: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.teal400,
    padding: 15,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonPressed: {
    backgroundColor: colors.teal200,
  },
  retryButtonText: {
    color: colors.teal900,
    fontSize: 16,
    fontFamily: "CourierL",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.teal900,
    padding: 20,
  },
  emptyText: {
    color: colors.platinum,
    fontSize: 24,
    fontFamily: "CourierL",
    marginBottom: 20,
    textAlign: "center",
  },
  shopButton: {
    backgroundColor: colors.teal400,
    padding: 15,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
  },
  shopButtonPressed: {
    backgroundColor: colors.teal200,
  },
  shopButtonText: {
    color: colors.teal900,
    fontSize: 16,
    fontFamily: "CourierL",
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontFamily: "CourierL",
    color: colors.platinum,
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
});
