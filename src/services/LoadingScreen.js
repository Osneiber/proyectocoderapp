import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { colors } from "../global/colors";

const LoadingScreen = ({ message = "Cargando..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary || "#007bff"} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo || "#ffffff",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "CourierL",
    color: colors.textPrimary || "#333",
  },
});

export default LoadingScreen;
