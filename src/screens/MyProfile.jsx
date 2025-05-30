import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetProfileImageQuery } from "../services/shopServices";
import { useSession } from "../hooks/useSession";
import { clearUser } from "../features/User/userSlice";
import { colors } from "../global/colors";
import Card from "../components/Card";

const MyProfile = ({ navigation }) => {
  const { imageCamera, localId } = useSelector((state) => state.auth.value);
  const { data: imageFromBase } = useGetProfileImageQuery(localId, {
    skip: !localId,
  });
  const { truncateSessionTable } = useSession();
  const dispatch = useDispatch();

  const launchCamera = () => {
    navigation.navigate("Image Selector");
  };

  const launchLocation = () => {
    navigation.navigate("List Address");
  };

  const signOut = async () => {
    try {
      await truncateSessionTable();
      dispatch(clearUser());
      Alert.alert("Sesión Cerrada", "Has cerrado sesión correctamente.");
    } catch (err) {
      Alert.alert("Error", "No se pudo cerrar la sesión. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        {imageFromBase?.image || imageCamera ? (
          <Image
            source={{ uri: imageFromBase?.image || imageCamera }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../../assets/images/defaultProfile.png")}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={launchCamera}>
            <Text style={styles.buttonText}>Cambiar Foto</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={launchLocation}>
            <Text style={styles.buttonText}>Mis Direcciones</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.signOutButton]}
            onPress={signOut}
          >
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      </Card>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fondo,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCard: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    backgroundColor: colors.teal600,
    alignItems: "center",
    gap: 20,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: colors.white,
    backgroundColor: colors.lightGray,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    backgroundColor: colors.boton,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "CourierL",
    fontWeight: "600",
  },
  signOutButton: {
    marginTop: 8,
    backgroundColor: colors.teal900,
  },
});