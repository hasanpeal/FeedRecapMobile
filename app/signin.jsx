import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/AuthContext";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [otpError, setOtpError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [load, setLoad] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const otpRefs = useRef(Array(6).fill(null));

  const { mail, login, logout, loading } = useAuth();

  const showToast = (type, text1) => {
    Toast.show({
      type,
      text1,
      position: "top",
    });
  };

  const validateForm = async () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (await validateForm()) {
      setLoad(true);
      try {
        const result = await axios.post(`${process.env.EXPO_PUBLIC_SERVER}/login`, { email, password });
        const { code, message } = result.data;
        if (code === 0) {
          login(email);
          showToast("success", message);
          router.navigate("/(tabs)/feed");
        } else {
          showToast("error", "Login failed");
        }
      } catch (err) {
        showToast("error", "Server error");
      } finally {
        setLoad(false);
      }
    }
  };

  const generateOtp = async () => {
    try {
      const result = await axios.post(`${process.env.EXPO_PUBLIC_SERVER}/sentOTP`, { email });
      setGeneratedOtp(result.data.otp);
      setIsOtpVisible(true);
    } catch (error) {
      showToast("error", "Failed to send OTP");
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
      setVerified(true);
      setTimeout(() => {
        setIsOtpVisible(false);
        setVerified(false);
      }, 3000);
      showToast("success", "OTP verified");
    } else {
      showToast("error", "Wrong OTP");
    }
  };

  const handleForgetPassword = () => {
    setIsOtpVisible(false);
    generateOtp();
  };

  const googleOauth = () => {
    // Redirect to Google OAuth
    window.location.href = `${process.env.EXPO_PUBLIC_SERVER}/auth/google/signin`;
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
            <Text style={styles.title}>FeedRecap Login</Text>

            {!isOtpVisible ? (
              <>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      formErrors.email ? styles.inputError : null,
                    ]}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {formErrors.email ? (
                    <Text style={styles.errorText}>{formErrors.email}</Text>
                  ) : null}

                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.passwordInput,
                        formErrors.password ? styles.inputError : null,
                      ]}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
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
                  {formErrors.password ? (
                    <Text style={styles.errorText}>{formErrors.password}</Text>
                  ) : null}

                  <TouchableOpacity onPress={handleForgetPassword}>
                    <Text style={styles.forgetPasswordText}>
                      Forget Password
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>

                  {/* Google Sign In Button */}
                  <TouchableOpacity
                    style={styles.googleButton}
                    onPress={googleOauth}
                  >
                    <Text style={styles.googleButtonText}>
                      Continue with &nbsp;
                    </Text>
                    <Ionicons name="logo-google" size={20} color="#6200ee" />
                  </TouchableOpacity>
                </View>
              </>
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOtpVerify}
                >
                  <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
              </View>
            )}
            <Toast />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    fontFamily: "Font4",
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
    marginBottom: 20,
    fontFamily: "Font4",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
    fontFamily: "Font4",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: "Font4",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: "Font4",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: "Font4",
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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#6200ee",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
  },
  googleButtonText: {
    color: "#6200ee",
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Font4",
  },
  otpContainer: {
    alignItems: "center",
    width: "100%",
    fontFamily: "Font4",
  },
  otpText: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
    marginBottom: 10,
    fontFamily: "Font4",
  },
  otpInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
    fontFamily: "Font4",
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
    fontFamily: "Font4",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginBottom: 12,
    fontFamily: "Font4",
  },
  forgetPasswordText: {
    color: "#6200ee",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "Font4",
  },
});
