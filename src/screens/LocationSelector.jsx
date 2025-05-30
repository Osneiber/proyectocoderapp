import { Button, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import MapPreview from "../components/MapPreview";
import { usePostLocationMutation } from "../services/shopServices";
import { useSelector } from "react-redux";
import { colors } from "../global/colors";
import { googleMapsApiKey } from "../databases/googleMaps";

const LocationSelector = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const [triggerPostUserLocation, result] = usePostLocationMutation();
  const { localId } = useSelector((state) => state.auth.value);

  const onConfirmAddress = () => {
    if (!address) {
      Alert.alert(
        "Dirección no encontrada",
        "No se pudo obtener la dirección. Por favor, intente obtener la ubicación de nuevo o verifique su conexión."
      );
      return;
    }
    const date = new Date();
    triggerPostUserLocation({
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: address,
        updateAt: `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`,
      },
      localId: localId,
    });
    Alert.alert("Ubicación Guardada", `Dirección confirmada: ${address}`);
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(
            "Permiso de localización denegado. Por favor, habilítalo en los ajustes de la aplicación."
          );
          setLocation({ latitude: "", longitude: "" });
          setAddress("");
          return;
        }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setError("");
      } catch (err) {
        setError(
          "Error al obtener la ubicación. Por favor, asegúrate de tener el GPS activado."
        );
        setLocation({ latitude: "", longitude: "" });
        setAddress("");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (location.latitude && location.longitude) {
        try {
          const url_reverse_geocode = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${googleMapsApiKey}`;
          const response = await fetch(url_reverse_geocode);
          if (!response.ok) {
            throw new Error(`Error de red o API: ${response.status}`);
          }
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setAddress(data.results[0].formatted_address);
            setError("");
          } else {
            setAddress("");
            setError(
              "No se pudo encontrar la dirección para las coordenadas obtenidas."
            );
          }
        } catch (err) {
          setAddress("");
          setError(
            "Error al obtener la dirección. Verifica tu conexión o la clave de API."
          );
        }
      } else {
        setAddress("");
      }
    })();
  }, [location, googleMapsApiKey]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Dirección</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {location.latitude && location.longitude ? (
        <>
          <Text style={styles.text}>
            Lat: {location.latitude.toFixed(5)}, Long:{" "}
            {location.longitude.toFixed(5)}
          </Text>
          <MapPreview location={location} />
          {address ? (
            <Text style={styles.address}>Dirección: {address}</Text>
          ) : (
            !error && <Text style={styles.text}>Obteniendo dirección...</Text>
          )}
          <Button
            onPress={onConfirmAddress}
            title="Confirmar Dirección"
            disabled={!address || !location.latitude}
            color={colors.primary}
          />
        </>
      ) : (
        !error && (
          <Text style={styles.text}>Obteniendo ubicación y permisos...</Text>
        )
      )}
    </View>
  );
};

export default LocationSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.fondo,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "CourierL",
    fontSize: 22,
    color: colors.white,
    marginBottom: 15,
  },
  text: {
    paddingTop: 10,
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginBottom: 10,
  },
  address: {
    padding: 10,
    fontFamily: "CourierL",
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginVertical: 10,
    backgroundColor: colors.surface,
    borderRadius: 5,
    width: "90%",
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    fontFamily: "CourierL",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
