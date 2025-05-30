import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  useWindowDimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { colors } from "../global/colors";
import InputForm from "../components/inputForm";
import SubmitButton from "../components/submitButton";
import { useSignInMutation } from "../services/authService";
import { setUser } from "../features/User/userSlice";
import { useDispatch } from "react-redux";
import { useSession } from "../hooks/useSession";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Formato de email inválido.")
    .required("El email es requerido."),
  password: yup.string().required("La contraseña es requerida."),
});

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [triggerSignIn, result] = useSignInMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMail, setErrorMail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const { width, height, scale } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const { insertSession } = useSession();

  const getDynamicFontSize = (baseSize) => {
    const scaleFactor = Math.min(scale, 1.5);
    return Math.round(baseSize * scaleFactor);
  };

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

  useEffect(() => {
    if (result.isSuccess) {
      (async () => {
        try {
          await insertSession({
            localId: result.data.localId,
            email: result.data.email,
            token: result.data.idToken,
          });
          dispatch(
            setUser({
              email: result.data.email,
              idToken: result.data.idToken,
              localId: result.data.localId,
            })
          );
          Alert.alert("Inicio de Sesión Exitoso", "¡Bienvenido de nuevo!");
        } catch (err) {
          Alert.alert(
            "Error de Sesión",
            "Hubo un problema al guardar tu sesión. Por favor, intenta iniciar sesión de nuevo."
          );
        }
      })();
    }
    if (result.isError) {
      let friendlyErrorMessage = "Credenciales inválidas. Verifica tu email y contraseña.";
      if (result.error && result.error.data && result.error.data.error && result.error.data.error.message) {
        const apiError = result.error.data.error.message;
        if (apiError === "EMAIL_NOT_FOUND") {
          friendlyErrorMessage = "El correo electrónico no está registrado.";
        } else if (apiError === "INVALID_PASSWORD") {
          friendlyErrorMessage = "La contraseña es incorrecta.";
        } else if (apiError === "INVALID_LOGIN_CREDENTIALS") {
           friendlyErrorMessage = "Credenciales de inicio de sesión inválidas.";
        }
      }
      Alert.alert("Error de Inicio de Sesión", friendlyErrorMessage);
    }
  }, [result, dispatch, insertSession]);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (result.isError) {
      result.reset();
    }
    if (errorMail) {
      setErrorMail("");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (result.isError) {
      result.reset();
    }
    if (errorPassword) {
      setErrorPassword("");
    }
  };

  const onSubmit = () => {
    try {
      setErrorMail("");
      setErrorPassword("");
      loginSchema.validateSync({ email, password }, { abortEarly: false });
      triggerSignIn({ email, password });
    } catch (err) {
      if (err.inner && err.inner.length > 0) {
        let emailValidationMessage = "";
        let passwordValidationMessage = "";
        err.inner.forEach((e) => {
          switch (e.path) {
            case "email":
              emailValidationMessage = e.message;
              setErrorMail(e.message);
              break;
            case "password":
              passwordValidationMessage = e.message;
              setErrorPassword(e.message);
              break;
          }
        });
        let alertMessage = "";
        if (emailValidationMessage)
          alertMessage += `Email: ${emailValidationMessage}\n`;
        if (passwordValidationMessage)
          alertMessage += `Contraseña: ${passwordValidationMessage}\n`;
        if (alertMessage) {
          Alert.alert("Error de Validación", alertMessage.trim());
        }
      } else if (err.path) {
        switch (err.path) {
          case "email":
            setErrorMail(err.message);
            Alert.alert("Error de Email", err.message);
            break;
          case "password":
            setErrorPassword(err.message);
            Alert.alert("Error de Contraseña", err.message);
            break;
          default:
            Alert.alert(
              "Error de Validación",
              err.message || "Por favor, revisa los campos."
            );
        }
      } else {
        Alert.alert(
          "Error de Validación",
          "Ha ocurrido un error inesperado. Por favor, revisa los campos."
        );
      }
    }
  };

  return (
    <View style={styles.main}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { fontSize: getDynamicFontSize(30) }]}>
            Bienvenido
          </Text>
        </View>
        <InputForm
          label={"Email"}
          onChange={handleEmailChange}
          error={errorMail}
          keyboardType="email-address"
          value={email}
        />
        <InputForm
          label={"Contraseña"}
          onChange={handlePasswordChange}
          error={errorPassword}
          isSecure={true}
          value={password}
        />
        <SubmitButton onPress={onSubmit} title="Iniciar Sesión" />

        <View style={styles.footer}>
          <Text style={[styles.sub, { fontSize: getDynamicFontSize(13) }]}>
            ¿No tienes una cuenta?
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.signupButton,
              pressed && styles.signupButtonPressed,
            ]}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text
              style={[
                styles.subLink,
                { fontSize: getDynamicFontSize(13), color: colors.letras },
              ]}
            >
              Registrarse
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.fondo,
  },
  container: {
    width: "90%",
    maxWidth: 400,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "CourierL",
    color: colors.letras,
    marginTop: 10,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  sub: {
    fontFamily: "CourierL",
    color: colors.white,
  },
  signupButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.boton,
  },
  signupButtonPressed: {
    backgroundColor: colors.accentMediumContrast,
    transform: [{ scale: 0.95 }],
  },
  subLink: {
    fontFamily: "CourierL",
    color: colors.textHighContrast,
    fontWeight: "bold",
  },
});