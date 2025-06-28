import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { Button, TamaguiProvider } from "tamagui";
import tamaguiConfig from "./tamagui.config";

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Button>Hello world</Button>
      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
