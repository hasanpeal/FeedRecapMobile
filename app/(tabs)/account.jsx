import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/hooks/AuthContext";
import axios from "axios";

export default function Account() {
  const { mail, logout } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(mail || ""); // Initialize with email from context
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mail) {
      fetchUserDetails();
    }
  }, [mail]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER}/getUserDetails`,
        {
          params: { email: mail },
        }
      );
      if (response.data.code === 0) {
        setFirstName(response.data.firstName || "");
        setLastName(response.data.lastName || "");
        setEmail(mail);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccountUpdate = async () => {
    if (!firstName || !lastName || !email) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER}/updateAccount`,
        {
          email: mail,
          newFirstName: firstName,
          newLastName: lastName,
          newEmail: email,
        }
      );
      if (response.data.code === 0) {
        alert("Account updated successfully");
      } else {
        alert("Error updating account.");
      }
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error updating account.");
    } finally {
      setLoading(false);
    }
  };

  const handleContactUs = () => {
    Linking.openURL("mailto:digest@feedrecap.com");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Account Settings</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleAccountUpdate}
            >
              <Text style={styles.buttonText}>Update Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactUs}
            >
              <Text style={styles.buttonText}>Contact Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 20,
    fontFamily: "Font4",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Font4",
  },
  updateButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  contactButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Font4",
  },
});
