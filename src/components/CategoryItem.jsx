import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { memo } from "react";
import Card from "./Card";
import { colors } from "../global/colors";
import { useDispatch } from "react-redux";
import { setCategorySelected } from "../features/Shop/shopSlice";

const CategoryItem = memo(({ category, navigation }) => {
  const dispatch = useDispatch();

  const handleNavigate = () => {
    dispatch(setCategorySelected(category));
    navigation.navigate("ItemListCategory", { category });
  };

  return (
    <Card style={styles.cardContainer}>
      <Pressable style={styles.pressable} onPress={handleNavigate}>
        <Text style={styles.text}>{category}</Text>
      </Pressable>
    </Card>
  );
});

export default CategoryItem;

const styles = StyleSheet.create({
  cardContainer: {
    width: "100%",
    marginVertical: 8,
    marginHorizontal: 0,
    borderRadius: 12,
    backgroundColor: colors.teal600,
  },
  pressable: {
    width: "100%",
    padding: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
    color: colors.white,
    fontFamily: "CourierL",
    textTransform: "capitalize",
  },
});
