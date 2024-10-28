import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";


export default function newsletter() {
  const [newsletterContent, setNewsletterContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const email = "pealh0320@gmail.com"; // Temporary email for now

  const fetchNewsletter = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER}/getNewsletter`,
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

  useEffect(() => {
    fetchNewsletter();
  }, []);

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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
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
