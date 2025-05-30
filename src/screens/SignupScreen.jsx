import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  useWindowDimensions,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { colors } from "../global/colors";
import InputForm from "../components/inputForm";
import SubmitButton from "../components/submitButton";
import { useDispatch } from "react-redux";
import { useSignUpMutation } from "../services/authService";
import { signupSchema } from "../validations/authSchema";
import { setUser } from "../features/User/userSlice";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [errorMail, setErrorMail] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const { width, height, scale } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const dispatch = useDispatch();
  const [triggerSignUp, result] = useSignUpMutation();

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
      dispatch(
        setUser({
          email: result.data.email,
          idToken: result.data.idToken,
          localId: result.data.localId,
        })
      );
      Alert.alert("Registro Exitoso", "¡Tu cuenta ha sido creada!");
    }
    if (result.isError) {
      const errorMessage =
        result.error?.data?.error?.message ||
        "Error al registrar. Por favor, inténtalo de nuevo.";
      Alert.alert("Error de Registro", errorMessage);
    }
  }, [result, dispatch]);

  const onSubmit = () => {
    try {
      setErrorMail("");
      setErrorPassword("");
      setErrorConfirmPassword("");
      signupSchema.validateSync(
        { email, password, confirmPassword },
        { abortEarly: false }
      );
      triggerSignUp({ email, password, returnSecureToken: true });
    } catch (err) {
      if (err.inner && err.inner.length > 0) {
        let emailValidationMessage = "";
        let passwordValidationMessage = "";
        let confirmPasswordValidationMessage = "";

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
            case "confirmPassword":
              confirmPasswordValidationMessage = e.message;
              setErrorConfirmPassword(e.message);
              break;
          }
        });

        let alertMessage = "";
        if (emailValidationMessage)
          alertMessage += `Email: ${emailValidationMessage}\n`;
        if (passwordValidationMessage)
          alertMessage += `Contraseña: ${passwordValidationMessage}\n`;
        if (confirmPasswordValidationMessage)
          alertMessage += `Confirmar Contraseña: ${confirmPasswordValidationMessage}\n`;

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
          case "confirmPassword":
            setErrorConfirmPassword(err.message);
            Alert.alert("Error de Confirmación", err.message);
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
          "Ha ocurrido un error inesperado durante la validación. Por favor, revisa los campos."
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
          <Text
            style={[
              styles.title,
              { fontSize: getDynamicFontSize(28), color: colors.letras },
            ]}
          >
            Crear Cuenta
          </Text>
        </View>
        <InputForm
          label={"Email"}
          onChange={setEmail}
          error={errorMail}
          keyboardType="email-address"
        />
        <InputForm
          label={"Contraseña"}
          onChange={setPassword}
          error={errorPassword}
          isSecure={true}
        />
        <InputForm
          label={"Confirmar Contraseña"}
          onChange={setconfirmPassword}
          error={errorConfirmPassword}
          isSecure={true}
        />
        <SubmitButton onPress={onSubmit} title="Registrarse" />
        <View style={styles.footer}>
          <Text style={[styles.sub, { fontSize: getDynamicFontSize(13) }]}>
            ¿Ya tienes una cuenta?
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={[
                styles.subLink,
                { fontSize: getDynamicFontSize(13), color: colors.letras },
              ]}
            >
              Iniciar Sesión
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

export default SignupScreen;

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
    shadowColor: colors.accentLowContrast,
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
    color: colors.black,
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
    color: colors.black,
  },
  loginButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.boton,
  },
  loginButtonPressed: {
    backgroundColor: colors.accentMediumContrast,
    transform: [{ scale: 0.95 }],
  },
  subLink: {
    fontFamily: "CourierL",
    color: colors.black,
    fontWeight: "bold",
  },
});
