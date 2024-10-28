import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const email = "pealh0320@gmail.com"; // Replace with actual email or context

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER}/api/posts`,
        { params: { email } }
      );
      if (response.data.code === 0) {
        const fetchedPosts = response.data.data;

        // Sort posts by time in descending order (most recent first)
        const sortedPosts = fetchedPosts.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        const categories = Array.from(
          new Set(sortedPosts.map((post) => post.category))
        );

        setPosts(sortedPosts);
        setDisplayedPosts(sortedPosts);
        setAvailableCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to filter posts based on selected category
  const filterPostsByCategory = (category) => {
    if (category === selectedCategory) {
      setDisplayedPosts(posts);
      setSelectedCategory(null);
    } else {
      setDisplayedPosts(posts.filter((post) => post.category === category));
      setSelectedCategory(category);
    }
  };

  const timeAgo = (time) => moment(time).fromNow();

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.time}>{timeAgo(item.time)}</Text>
      </View>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <View style={styles.postActions}>
        <View style={styles.likesContainer}>
          <Ionicons name="heart-outline" size={20} color="#6200ee" />
          <Text style={styles.likesText}>{item.likes}</Text>
        </View>
        <TouchableOpacity
          style={styles.viewPostButton}
          onPress={() =>
            Linking.openURL(`https://twitter.com/i/web/status/${item.tweet_id}`)
          }
        >
          <Text style={styles.viewPostButtonText}>View Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.categoriesContainer}>
          {availableCategories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => filterPostsByCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <FlashList
            data={displayedPosts}
            renderItem={renderItem}
            estimatedItemSize={100} // Adjust based on typical item height
            keyExtractor={(item) => item.tweet_id}
            contentContainerStyle={styles.feedContainer}
          />
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
    backgroundColor: "#ffffff",
    paddingTop: 20,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 20,
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
  feedContainer: {
    paddingHorizontal: 10,
  },
  postContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    fontFamily: "Font4",
  },
  time: {
    fontSize: 12,
    color: "#888",
    fontFamily: "Font4",
  },
  text: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
    fontFamily: "Font4",
  },
  category: {
    fontSize: 12,
    color: "#6200ee",
    marginBottom: 10,
    fontFamily: "Font4",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesText: {
    fontSize: 14,
    color: "#6200ee",
    marginLeft: 5,
    fontFamily: "Font4",
  },
  viewPostButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  viewPostButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Font4",
  },
});
