import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { colors } from "../global/colors";
import Feather from "@expo/vector-icons/Feather";
import OrderItemDetail from "../components/OrderItemDetail";

const OrderDetail = ({ route, navigation }) => {
  const { order } = route.params;
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

  const keyExtractor = (item, index) => `${order.id}-${item.id}-${index}`;

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
      <View style={styles.header}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.platinum} />
        </Pressable>
        <Text style={styles.title}>Detalle de la Orden</Text>
      </View>

      <View style={styles.orderInfo}>
        <Text style={styles.date}>
          Fecha: {new Date(order.createdAt).toLocaleString()}
        </Text>
        <Text style={styles.total}>Total: ${order.total}</Text>
      </View>

      <FlatList
        data={order.items}
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
            <OrderItemDetail item={item} />
          </Animated.View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </Animated.View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.teal600,
    marginRight: 16,
  },
  backButtonPressed: {
    backgroundColor: colors.teal400,
    transform: [{ scale: 0.95 }],
  },
  title: {
    fontSize: 24,
    fontFamily: "CourierL",
    color: colors.platinum,
  },
  orderInfo: {
    backgroundColor: colors.teal600,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  date: {
    fontSize: 16,
    fontFamily: "Josefin",
    color: colors.platinum,
    marginBottom: 8,
  },
  total: {
    fontSize: 20,
    fontFamily: "CourierL",
    color: colors.letras,
  },
  listContainer: {
    paddingBottom: 20,
  },
});
