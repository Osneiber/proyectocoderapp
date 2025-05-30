import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../global/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Search = ({onSearch = ()=>{}, error="", goBack=()=>{}}) => {
  const [keyword, setKeyword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={goBack}>
          <Ionicons name="chevron-back" size={28} color={colors.platinum} />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>
      </View>
      <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
          placeholder="Buscar productos..."
          placeholderTextColor={colors.white}
        value={keyword}
        onChangeText={setKeyword}
      />
        <View style={styles.buttonsContainer}>
          {keyword.length > 0 && (
            <Pressable 
              style={styles.clearButton} 
              onPress={() => {
                setKeyword("");
                onSearch("");
              }}
            >
              <Ionicons name="close-circle" size={24} color={colors.platinum} />
      </Pressable>
          )}
          <Pressable 
            style={styles.searchButton} 
            onPress={() => onSearch(keyword)}
          >
            <Ionicons name="search" size={24} color={colors.platinum} />
      </Pressable>
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: colors.fondo,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  backText: {
    color: colors.platinum,
    fontSize: 18,
    fontFamily: "CourierL",
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textLowContrast,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    color: colors.white,
    fontFamily: "CourierL",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  errorText: {
    color: colors.platinum,
    fontFamily: "CourierL",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    marginBottom: 16,
  },
});
