import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { memo } from "react";
import { colors } from "../global/colors";
import Card from "./Card";

const OrderItemDetail = memo(({ item }) => {
  return (
    <Card style={styles.card}>
      <Image
        source={{ uri: item.images[0] }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>
        <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
      </View>
    </Card>
  );
});

export default OrderItemDetail;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 12,
    backgroundColor: colors.teal600,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 4,
  },
  title: {
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.platinum,
  },
  price: {
    fontFamily: "CourierL",
    fontSize: 18,
    color: colors.teal200,
  },
  quantity: {
    fontFamily: "CourierL",
    fontSize: 14,
    color: colors.platinum,
  },
});
