import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import axios from "axios";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";
import { useAuth } from "@/hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export default function newsletter() {
  const [newsletterContent, setNewsletterContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { mail, login, logout } = useAuth();

  useEffect(() => {
    if (mail) fetchNewsletter(mail);
  }, [mail]);

  const fetchNewsletter = async (email) => {
    console.log(email);
    setLoading(true);
    try {
      const response = await axios.get(
        `${Constants.expoConfig.extra.SERVER}/getNewsletter`,
        { params: { email } }
      );
      if (response.data.code === 0) {
        setNewsletterContent(response.data.newsletter);
      } else {
        setErrorMessage(response.data.message || "Newsletter not found");
      }
    } catch (error) {
      console.error("Error fetching newsletter:", error);
      setErrorMessage("An error occurred while fetching the newsletter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Latest Newsletter</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <RenderHTML
              contentWidth={Dimensions.get("window").width}
              source={{ html: newsletterContent }}
              tagsStyles={htmlStyles}
            />
          </ScrollView>
        )}
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
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 40,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Font4",
  },
  contentContainer: {
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "Font4",
  },
});

const htmlStyles = {
  p: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 10,
    fontFamily: "Font4",
  },
  h1: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 15,
    fontFamily: "Font4",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
    fontFamily: "Font4",
  },
  h3: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
    fontFamily: "Font4",
  },
  a: {
    color: "#6200ee",
    textDecorationLine: "underline",
    fontFamily: "Font4",
  },
};
