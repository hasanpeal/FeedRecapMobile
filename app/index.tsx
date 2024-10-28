import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomePage() {
  const router = useRouter(); // Hook from expo-router
  const { mail, login, logout, loading } = useAuth();

  useEffect(() => {
    const checkStoredEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (storedEmail) {
          login(storedEmail); // Update context with email
          router.replace("/(tabs)/feed"); // Redirect to dashboard
        }
      } catch (error) {
        console.error("Error checking stored email", error);
      }
    };

    if (!mail) {
      checkStoredEmail();
    }
  }, [mail]);

  // Display a loading spinner while checking for stored email
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>FeedRecap</Text>
        <Text style={styles.description}>
          Get daily curated tweets and summaries without endless scrolling
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.navigate("./signin")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => router.navigate("./signup")}
        >
          <Text style={styles.outlinedButtonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => router.navigate("./newuser")}
        >
          <Text style={styles.outlinedButtonText}>New User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => router.navigate("./dashboard")}
        >
          <Text style={styles.outlinedButtonText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => router.navigate("/(tabs)/feed")}
        >
          <Text style={styles.outlinedButtonText}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={() => router.navigate("/(tabs)/newsletter")}
        >
          <Text style={styles.outlinedButtonText}>Newsletter</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
    fontFamily: "Font4",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#444444",
    marginBottom: 30,
    fontFamily: "Font4",
  },
  button: {
    backgroundColor: "#6200ee",
    width: "80%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Font4",
  },
  outlinedButton: {
    borderColor: "#6200ee",
    borderWidth: 2,
    width: "80%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  outlinedButtonText: {
    color: "#6200ee",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Font4",
  },
});
