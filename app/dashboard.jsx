import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Dashboard() {
  const [emailContext, setEmailContext] = useState("user@example.com");
  const [categories, setCategories] = useState([]);
  const [time, setTime] = useState([]);
  const [timezone, setTimezone] = useState(null);
  const [dbTimezone, setDbTimezone] = useState(null);
  const [totalNewsletters, setTotalNewsletters] = useState(0);
  const [latestNewsletter, setLatestNewsletter] = useState(null);
  const [loading, setLoading] = useState(false);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const categoriesRes = await axios.get(`${process.env.EXPO_PUBLIC_SERVER}/getCategories`, { params: { email: emailContext } });
      const timesRes = await axios.get(`${process.env.EXPO_PUBLIC_SERVER}/getTimes`, { params: { email: emailContext } });
      const timezoneRes = await axios.get(`${process.env.EXPO_PUBLIC_SERVER}/getTimezone`, { params: { email: emailContext } });
      const totalNewslettersRes = await axios.get(`${process.env.EXPO_PUBLIC_SERVER}/getTotalNewsletters`, { params: { email: emailContext } });
      const newsletterRes = await axios.get(`${process.env.EXPO_PUBLIC_SERVER}/getNewsletter`, { params: { email: emailContext } });

      setCategories(categoriesRes.data.categories);
      setTime(timesRes.data.time);
      setDbTimezone(timezoneRes.data.timezone);
      setTotalNewsletters(totalNewslettersRes.data.totalnewsletter);
      setLatestNewsletter(newsletterRes.data.newsletter);
    } catch (err) {
      Toast.show({ type: "error", text1: "Error fetching user data." });
    }
  };

  const handleCategoryUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER}/updateCategories`, {
        email: emailContext,
        categories,
      });
      setLoading(false);
      Toast.show({ type: "success", text1: response.data.code === 0 ? "Categories Updated" : "Server Error" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Server Error" });
      setLoading(false);
    }
  };

  const handleTimeUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER}/updateTimes`, { email: emailContext, time });
      setLoading(false);
      Toast.show({ type: "success", text1: response.data.code === 0 ? "Times Updated" : "Server Error" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Server Error" });
      setLoading(false);
    }
  };

  const handleTimezoneUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER}/updateTimezone`, { email: emailContext, timezone });
      setLoading(false);
      Toast.show({ type: "success", text1: response.data.code === 0 ? "Timezone Updated" : "Server Error" });
    } catch (err) {
      Toast.show({ type: "error", text1: "Server Error" });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Dashboard</Text>

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
                onPress={() => setCategories(prev =>
                  prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
                )}
              >
                <Text
                  style={[
                    styles.buttonText,
                    categories.includes(category) && styles.buttonTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleCategoryUpdate} disabled={loading}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.actionButtonText}>Update Categories</Text>}
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
                onPress={() => setTime(prev =>
                  prev.includes(timeOption) ? prev.filter(t => t !== timeOption) : [...prev, timeOption]
                )}
              >
                <Text
                  style={[
                    styles.buttonText,
                    time.includes(timeOption) && styles.buttonTextActive,
                  ]}
                >
                  {timeOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleTimeUpdate} disabled={loading}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.actionButtonText}>Update Time</Text>}
          </TouchableOpacity>
        </View>

        {/* Timezone Update Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Timezone</Text>
          <Text style={styles.text}>Detected Timezone: {timezone}</Text>
          <Text style={styles.text}>Registered Timezone: {dbTimezone}</Text>
          {timezone !== dbTimezone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleTimezoneUpdate} disabled={loading}>
              {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.actionButtonText}>Update Timezone</Text>}
            </TouchableOpacity>
          )}
        </View>

        {/* Newsletter Stats Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Newsletter Information</Text>
          <Text style={styles.statText}>Total Newsletters Received: {totalNewsletters}</Text>
          <Text style={styles.statText}>Latest Newsletter: {latestNewsletter || "No newsletters available"}</Text>
        </View>
        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
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
  buttonText: {
    fontSize: 16,
    color: "#6200ee",
  },
  buttonTextActive: {
    color: "#ffffff",
  },
  actionButton: {
    backgroundColor: "#6200ee",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    minWidth: 150,
  },
 
  actionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  statText: {
    fontSize: 16,
    color: "#444",
    marginTop: 8,
    textAlign: "center",
  },
});
