import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Signup() {
  const router = useRouter();
  const [flag, setFlag] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [verified, setVerified] = useState(false);
  const [load, setLoad] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { mail, login, logout } = useAuth();

  const otpRefs = useRef(Array(6).fill(null));

  const showToast = (type, text1) => {
    Toast.show({
      type,
      text1,
      position: "top",
    });
  };

  async function emailAlreadyExist() {
    try {
      const result = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER}/validateEmail`,
        {
          params: { email },
        }
      );
      return result.data.code === 0;
    } catch (err) {
      console.error("Error in emailAlreadyExist function:", err);
      return false;
    }
  }

  const validateForm = async () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
    let isValid = true;

    if (!firstName) {
      errors.firstName = "First name is required";
      isValid = false;
    }
    if (!lastName) {
      errors.lastName = "Last name is required";
      isValid = false;
    }
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Not a valid email";
      isValid = false;
    } else if (await emailAlreadyExist()) {
      errors.email = "Email already registered";
      isValid = false;
    }
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (
      password.length < 8 ||
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      errors.password =
        "Password must be at least 8 characters long and include a letter and a number";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSignup = async () => {
    if (await validateForm()) {
      generateOtp();
      setFlag(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpVerify = async () => {
    if (otp.includes("")) {
      setOtpError(true);
      return;
    }

    setOtpError(false);
    if (generatedOtp === otp.join("")) {
      try {
        setLoad(true);
        const result = await axios.post(
          `${process.env.EXPO_PUBLIC_SERVER}/register`,
          {
            firstName,
            lastName,
            email,
            password,
          }
        );

        if (result.data.code === 0) {
          login(email);
          showToast("success", "Sign up successful");
          router.navigate("/newuser");
        } else {
          showToast("error", "Server error");
        }
      } catch (error) {
        console.error(error);
        showToast("error", "An error occurred");
      } finally {
        setLoad(false);
      }
    } else {
      setVerified(true);
      setTimeout(() => setVerified(false), 3000);
    }
  };

  const generateOtp = async () => {
    try {
      const result = await axios.post(
        `${process.env.EXPO_PUBLIC_SERVER}/sentOTP`,
        {
          email,
        }
      );
      setGeneratedOtp(result.data.otp);
    } catch (error) {
      console.error("Error generating OTP:", error);
      showToast("error", "Failed to send OTP");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={styles.container} // Ensure it covers the entire screen
      >
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.title}>Sign Up </Text>
            {flag ? (
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.font]}
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholderTextColor="#aaa"
                />
                {formErrors.firstName && (
                  <Text style={styles.errorText}>
                    &nbsp;{formErrors.firstName}
                  </Text>
                )}
                <TextInput
                  style={[styles.input, styles.font]}
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholderTextColor="#aaa"
                />
                {formErrors.lastName && (
                  <Text style={styles.errorText}>
                    &nbsp;{formErrors.lastName}
                  </Text>
                )}
                <TextInput
                  style={[styles.input, styles.font]}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#aaa"
                />
                {formErrors.email && (
                  <Text style={styles.errorText}>&nbsp;{formErrors.email}</Text>
                )}
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, styles.font]}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {formErrors.password && (
                  <Text style={styles.errorText}>
                    &nbsp;{formErrors.password}
                  </Text>
                )}
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.otpContainer}>
                <Text style={styles.otpText}>
                  Please enter the 6-digit OTP sent to your email
                </Text>
                <View style={styles.otpInputContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      style={[
                        styles.otpInput,
                        otpError && !digit ? styles.otpInputError : null,
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(index, value)}
                      keyboardType="number-pad"
                      maxLength={1}
                      ref={(ref) => (otpRefs.current[index] = ref)}
                    />
                  ))}
                </View>
                {verified && <Text style={styles.errorText}>Wrong OTP</Text>}
                {load ? (
                  <ActivityIndicator size="large" color="#6200ee" />
                ) : (
                  <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={handleOtpVerify}
                  >
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        <Toast />
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
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
    fontFamily: "Font4", // Ensure consistency with the homepage theme
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Font4",
    color: "#444",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: "Font4",
    color: "#444",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Font4",
  },
  otpContainer: {
    alignItems: "center",
    width: "100%",
  },
  otpText: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
    fontFamily: "Font4",
    marginBottom: 10,
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Font4",
  },
  otpInputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 12,
    fontFamily: "Font4",
  },
  verifyButton: {
    backgroundColor: "#6200ee",
    borderRadius: 8,
    paddingVertical: 15, // Larger padding for the "Verify" button
    paddingHorizontal: 30, // Wider button specifically for "Verify"
    alignItems: "center",
    marginTop: 20,
  },
});

