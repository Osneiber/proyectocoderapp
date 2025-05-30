import React, { useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Animated,
  Pressable,
} from "react-native";

import { colors } from "../global/colors";

import CategoryItem from "../components/CategoryItem";

import { useGetCategoriesQuery } from "../services/shopServices";

const ITEM_HEIGHT = 80; 

const Home = ({ route, navigation }) => {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
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
        <Text style={styles.errorText}>Error al cargar las categorías</Text>
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

  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

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
      <Text style={styles.title}>Categorías</Text>
      <FlatList
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        data={categories}
        renderItem={({ item, index }) => (
          <Animated.View
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
            <CategoryItem category={item} navigation={navigation} />
          </Animated.View>
        )}
        keyExtractor={(itemElement) => itemElement}
        contentContainerStyle={styles.flatListContent}
        getItemLayout={getItemLayout}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
    </Animated.View>
  );
};

export default Home;

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
    fontFamily: "Josefin",
    fontWeight: "bold",
  },
  title: {
    fontSize: 32,
    fontFamily: "Josefin",
    color: colors.platinum,
    marginBottom: 20,
    textAlign: "center",
  },
  flatList: {
    width: "100%",
  },
  flatListContent: {
    padding: 16,
  },
});
