import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export default function SelectCategories() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // This will be set by the context or from AsyncStorage in React Native
  const [categories, setCategories] = useState([]);
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState(null);

  const { mail, login, logout } = useAuth();

  const availableCategories = [
    "Politics",
    "Geopolitics",
    "Finance",
    "AI",
    "Tech",
    "Crypto",
    "Meme",
    "Sports",
    "Entertainment",
  ];
  const availableTimes = ["Morning", "Afternoon", "Night"];

  useEffect(() => {
    const checkStoredEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (storedEmail) {
          console.log('stored email: ', storedEmail);
          await login(storedEmail); // Update context with email
          setEmail(storedEmail);
        }
      } catch (error) {
        console.error("Error checking stored email", error);
      }
    };

    if (!email) {
      checkStoredEmail();
    }
  }, [email]);

  useEffect(() => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(userTimezone);
  }, []);

  const handleCategoryChange = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const handleTimeChange = (time) => {
    if (times.includes(time)) {
      setTimes(times.filter((t) => t !== time));
    } else {
      setTimes([...times, time]);
    }
  };

  const handleSubmit = async () => {
    if (categories.length === 0 || times.length === 0) {
      Toast.show({
        type: "error",
        text1: "Select at least one category and time",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER}/updateUserPreferences`,
        {
          email,
          timezone,
          categories,
          time: times,
        }
      );
      if (response.data.code === 0) {
        Toast.show({
          type: "success",
          text1: "You are successfully signed up for FeedRecap!",
        });
        router.navigate("/(tabs)/feed");
      } else {
        Toast.show({ type: "error", text1: "Server error" });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={styles.container} // Ensure it covers the entire screen
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Choose categories to subscribe to</Text>
          <View style={styles.buttonContainer}>
            {availableCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  categories.includes(category) && styles.categoryButtonActive,
                ]}
                onPress={() => handleCategoryChange(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    categories.includes(category) &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subtitle}>
            Select times for your daily newsletter
          </Text>
          <View style={styles.buttonContainer}>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  times.includes(time) && styles.timeButtonActive,
                ]}
                onPress={() => handleTimeChange(time)}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    times.includes(time) && styles.timeButtonTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {timezone && (
            <Text style={styles.timezoneText}>
              Detected Timezone: {timezone}
            </Text>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          <Toast />
        </ScrollView>
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
  scrollContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Font4",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Font4",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: "#6200ee",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#6200ee",
    fontFamily: "Font4",
  },
  categoryButtonTextActive: {
    color: "#ffffff",
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  timeButtonActive: {
    backgroundColor: "#6200ee",
  },
  timeButtonText: {
    fontSize: 16,
    color: "#6200ee",
    fontFamily: "Font4",
  },
  timeButtonTextActive: {
    color: "#ffffff",
  },
  timezoneText: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
    fontFamily: "Font4",
  },
  submitButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Font4",
  },
});
