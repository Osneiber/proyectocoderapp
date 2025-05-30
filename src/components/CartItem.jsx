import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { memo } from "react";
import { colors } from "../global/colors";
import Entypo from "@expo/vector-icons/Entypo";
import Card from "./Card";
import { useDispatch } from "react-redux";
import { removeCartItem } from "../features/Cart/cartSlice";

const CartItem = memo(({ cartItem }) => {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(removeCartItem(cartItem.id));
  };

  return (
    <Card style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{cartItem.title}</Text>
        <Text style={styles.brand}>{cartItem.brand}</Text>
        <Text style={styles.price}>${cartItem.price}</Text>
        <Text style={styles.quantity}>Cantidad: {cartItem.quantity}</Text>
        <Pressable onPress={handleRemoveItem}>
          <View style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </View>
        </Pressable>
      </View>
    </Card>
  );
});

export default CartItem;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 12,
    backgroundColor: colors.fondo2,
    padding: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    fontFamily: "CourierT",
    fontSize: 20,
    color: colors.platinum,
  },
  brand: {
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.teal200,
  },
  price: {
    fontFamily: "CourierL",
    fontSize: 18,
    color: colors.platinum,
    fontWeight: "bold",
  },
  quantity: {
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.teal200,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.burgundy,
  },
  deleteButtonText: {
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.platinum,
    fontWeight: "bold",
  },
});
