import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Font1: require("../assets/fonts/PassionOne-Regular.ttf"),
    Font2: require("../assets/fonts/FjallaOne-Regular.ttf"),
    Font3: require("../assets/fonts/Anton-Regular.ttf"),
    Font4: require("../assets/fonts/Raleway-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="newuser" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
