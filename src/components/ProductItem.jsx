import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo } from "react";
import Card from "./Card";
import { colors } from "../global/colors";

import { useDispatch } from "react-redux";
import { setIdSelected } from "../features/Shop/shopSlice";

const ProductItem = memo(({ product, navigation }) => {
  const dispatch = useDispatch();

  const handleNavigate = () => {
    dispatch(setIdSelected(product.title));
    navigation.navigate("ItemDetail", { productId: product.id });
  };

  return (
    <Card style={styles.cardContainer}>
      <Pressable style={styles.pressable} onPress={handleNavigate}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={{ uri: product.images[0] }}
          loading="lazy"
          progressiveRenderingEnabled={true}
          fadeDuration={300}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.price}>${product.price}</Text>
        </View>
      </Pressable>
    </Card>
  );
});

export default ProductItem;

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 12,
    backgroundColor: colors.teal600,
    overflow: "hidden",
  },
  pressable: {
    width: "100%",
    flexDirection: "row",
    padding: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontFamily: "CourierL",
    color: colors.platinum,
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    fontFamily: "CourierL",
    color: colors.teal200,
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontFamily: "CourierL",
    color: colors.platinum,
    fontWeight: "bold",
  },
});
