import { Button, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { useDispatch, useSelector } from "react-redux";
import { setCameraImage } from "../features/User/userSlice";
import { colors } from "../global/colors";
import { usePostProfileImageMutation } from "../services/shopServices";

const ImageSelector = ({ navigation }) => {
  const [image, setImage] = useState(null);

  const [triggerPostImage, result] = usePostProfileImageMutation();
  const { localId } = useSelector((state) => state.auth.value);
  const dispatch = useDispatch();

  const verifyCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos insuficientes",
        "Necesitas conceder permisos para la cámara para usar esta funcionalidad.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const permissionCamera = await verifyCameraPermissions();
      if (permissionCamera) {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          base64: true,
          quality: 0.2,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          const imageUri = `data:image/jpeg;base64,${selectedAsset.base64}`;
          setImage(imageUri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al intentar tomar la foto.");
    }
  };

  const confirmImage = async () => {
    if (!image || !localId) {
      Alert.alert(
        "Error",
        "No hay imagen para confirmar o falta el ID de usuario."
      );
      return;
    }
    try {
      dispatch(setCameraImage(image));
      await triggerPostImage({ image, localId }).unwrap();
      Alert.alert("Éxito", "La imagen ha sido guardada y se está subiendo.");
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error al Guardar",
        "No se pudo guardar la imagen. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.buttonGap}>
            <Button
              title="Tomar otra foto"
              onPress={pickImage}
              color={colors.primary}
            />
          </View>
          <Button
            title="Confirmar foto"
            onPress={confirmImage}
            color={colors.success}
          />
        </>
      ) : (
        <View style={styles.noPhotoContainer}>
          <Text style={styles.noPhotoText}>No hay foto para mostrar</Text>
          <Button
            title="Tomar una foto"
            onPress={pickImage}
            color={colors.primary}
          />
        </View>
      )}
    </View>
  );
};

export default ImageSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: colors.fondo || "#f0f0f0",
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 5,
    marginBottom: 10,
  },
  noPhotoContainer: {
    padding: 20,
    gap: 15,
    borderWidth: 2,
    borderColor: colors.accentMediumContrast || colors.black || "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface || "#fff",
  },
  noPhotoText: {
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.textSecondary || "#333",
  },
  buttonGap: {
    marginBottom: 10,
  },
});
