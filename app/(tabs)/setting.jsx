import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/AuthContext";
import Constants from "expo-constants";

export default function setting() {
  const { mail } = useAuth(); // Retrieve stored email from context
  const [categories, setCategories] = useState([]);
  const [time, setTime] = useState([]);
  const [timezone, setTimezone] = useState(null);
  const [dbTimezone, setDbTimezone] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalNewsletters, setTotalNewsletters] = useState(0);

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
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(detectedTimezone);
  }, []);

  useEffect(() => {
    if (mail) {
      fetchData();
    }
  }, [mail]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoriesRes = await axios.get(
        `${Constants.expoConfig.extra.SERVER}/getCategories`,
        { params: { email: mail } }
      );
      const timesRes = await axios.get(
        `${Constants.expoConfig.extra.SERVER}/getTimes`,
        { params: { email: mail } }
      );
      const timezoneRes = await axios.get(
        `${Constants.expoConfig.extra.SERVER}/getTimezone`,
        { params: { email: mail } }
      );

      const totalNewslettersRes = await axios.get(
        `${Constants.expoConfig.extra.SERVER}/getTotalNewsletters`,
        { params: { email: mail } }
      );

      setCategories(categoriesRes.data.categories || []);
      setTime(timesRes.data.time || []);
      setDbTimezone(timezoneRes.data.timezone || timezone);
      setTotalNewsletters(totalNewslettersRes.data.totalnewsletter || 0);
    } catch (error) {
      Toast.show({ type: "error", text1: "Error fetching data" });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER}/updateCategories`,
        { email: mail, categories }
      );
      setLoading(false);
      Toast.show({
        type: "success",
        text1: response.data.code === 0 ? "Categories Updated" : "Server Error",
      });
    } catch (error) {
      setLoading(false);
      Toast.show({ type: "error", text1: "Server Error" });
    }
  };

  const handleTimeUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER}/updateTimes`,
        { email: mail, time }
      );
      setLoading(false);
      Toast.show({
        type: "success",
        text1: response.data.code === 0 ? "Times Updated" : "Server Error",
      });
    } catch (error) {
      setLoading(false);
      Toast.show({ type: "error", text1: "Server Error" });
    }
  };

  const handleTimezoneUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${Constants.expoConfig.extra.SERVER}/updateTimezone`,
        { email: mail, timezone }
      );
      setLoading(false);
      Toast.show({
        type: "success",
        text1: response.data.code === 0 ? "Timezone Updated" : "Server Error",
      });
    } catch (error) {
      setLoading(false);
      Toast.show({ type: "error", text1: "Server Error" });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Categories Update Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Update Categories</Text>
          <View style={styles.buttonContainer}>
            {availableCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  categories.includes(category) && styles.categoryButtonActive,
                ]}
                onPress={() =>
                  setCategories((prev) =>
                    prev.includes(category)
                      ? prev.filter((c) => c !== category)
                      : [...prev, category]
                  )
                }
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCategoryUpdate}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>
              {loading ? "Updating..." : "Update Categories"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Times Update Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Update Preferred Time</Text>
          <View style={styles.buttonContainer}>
            {availableTimes.map((timeOption) => (
              <TouchableOpacity
                key={timeOption}
                style={[
                  styles.categoryButton,
                  time.includes(timeOption) && styles.categoryButtonActive,
                ]}
                onPress={() =>
                  setTime((prev) =>
                    prev.includes(timeOption)
                      ? prev.filter((t) => t !== timeOption)
                      : [...prev, timeOption]
                  )
                }
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    time.includes(timeOption) &&
                      styles.categoryButtonTextActive,
                  ]}
                >
                  {timeOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTimeUpdate}
            disabled={loading}
          >
            <Text style={styles.actionButtonText}>
              {loading ? "Updating..." : "Update Time"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timezone Update Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timezone</Text>
          <Text style={styles.text}>Detected Timezone: {timezone}</Text>
          <Text style={styles.text}>Registered Timezone: {dbTimezone}</Text>
          {timezone !== dbTimezone && (
            <TouchableOpacity
              style={[styles.actionButton, styles.updateTimezoneButton]}
              onPress={handleTimezoneUpdate}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>
                {loading ? "Updating..." : "Update Timezone"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.newsletterTitle}>Total Newsletters Received</Text>
          <Text style={styles.newsletterCount}>{totalNewsletters}</Text>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Add this to your existing stylesheet for the "Total Newsletters Received" box
  newsletterContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: "90%", // To match the width of the other cards
  },

  newsletterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    fontFamily: "Font4", // Match the font style
    marginBottom: 10,
    textAlign: "center",
  },

  newsletterCount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "Font4", // Match the font style
    textAlign: "center",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 20,
    fontFamily: "Font4",
  },
  card: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    fontFamily: "Font4", // Match the font style
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  categoryButtonActive: {
    backgroundColor: "#6200ee",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#6200ee",
    fontFamily: "Font4",
  },
  categoryButtonTextActive: {
    color: "#ffffff",
    fontFamily: "Font4",
  },
  actionButton: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Font4",
  },
  updateTimezoneButton: {
    backgroundColor: "#ff3b30",
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginVertical: 5,
    textAlign: "center",
    fontFamily: "Font4",
  },
});
