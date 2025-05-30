import { colors } from "./src/global/colors";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import Navigator from "./src/navigation/Navigator";
import { Provider } from "react-redux";
import store from "./src/store";
import { useEffect } from "react";
import { useSession } from "./src/hooks/useSession";

const App = () => {
  const {initDB} = useSession()
  const [fontsLoaded, fontError] = useFonts({
    CourierT: require("./assets/Fonts/courier-prime/CourierPBItalic.ttf"),
    CourierL: require("./assets/Fonts/courier-prime/CourierPrime.ttf"),
  });

  useEffect(()=>{
    initDB()
  }, [])

  if (!fontsLoaded || fontError) {
    return null;
  }

  if (fontsLoaded && !fontError) {
    return (
      <SafeAreaView style={styles.container}>
        <Provider store={store}>
          <Navigator />
        </Provider>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: colors.burgundy,
  },
});

export default App;
