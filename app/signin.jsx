import React, { useState, useRef, useEffect } from "react";
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
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: Constants.expoConfig.extra.WEB,
  scopes: ["email", "profile"],
  // scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: false,
  forceCodeForRefreshToken: true,
  iosClientId: Constants.expoConfig.extra.IOS,
  androidClientId: Constants.expoConfig.extra.ANDROID,
});

export default function signin() {
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
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef(Array(6).fill(null));

  const { mail, login, logout } = useAuth();

  const showToast = (type, text1) => {
    Toast.show({
      type,
      text1,
      position: "top",
    });
  };

 const handleGoogleSignIn = async () => {
   try {
     setLoading(true);
     await GoogleSignin.hasPlayServices(); // Ensures Google Play Services are available

     const userInfo = await GoogleSignin.signIn();
     console.log("userInfo: ", userInfo.data);
     
     const email = userInfo.data.user.email;
     const firstName = userInfo.data.user.givenName;
     const lastName = userInfo.data.user.familyName

     console.log("User Info:", { email, firstName, lastName });

     // Validate or register the user on your backend
     const emailCheck = await axios.get(
       `${Constants.expoConfig.extra.SERVER}/validateEmail`,
       {
         params: { email },
       }
     );

     if (emailCheck.data.code === 0) {
       // User exists; check if they are new
       const newUserCheck = await axios.get(
         `${Constants.expoConfig.extra.SERVER}/getIsNewUser`,
         { params: { email } }
       );

       if (newUserCheck.data.isNewUser) {
         await login(email);
         router.navigate("/newuser");
       } else {
         await login(email);
         router.navigate("/(tabs)/feed");
       }
     } else {
       // Register new user
       await axios.post(`${Constants.expoConfig.extra.SERVER}/register`, {
         firstName,
         lastName,
         email,
         password: Constants.expoConfig.extra.PASSWORD, // Set a default password or handle it per your app's logic
       });
       await login(email);
       router.navigate("/newuser");
     }
   } catch (error) {
     console.log("Error with Google Sign-In:", error);
     handleSignInError(error);
   } finally {
     setLoading(false);
   }
 };

 const handleSignInError = (error) => {
   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
     Toast.show({ type: "info", text1: "Sign-in cancelled" });
   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
     Toast.show({ type: "error", text1: "Google Play services not available" });
   } else if (error.code === statusCodes.IN_PROGRESS) {
     Toast.show({ type: "error", text1: "Sign-in already in progress" });
   } else {
     Toast.show({ type: "error", text1: `Error with Google Sign-In: ${error}` });
   }
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
        const result = await axios.post(
          `${Constants.expoConfig.extra.SERVER}/login`,
          { email, password }
        );
        const { code, message } = result.data;
        if (code === 0) {
          await login(email);

          const response = await axios.get(
            `${Constants.expoConfig.extra.SERVER}/getIsNewUser`,
            {
              params: { email: email },
            }
          );

          if (response.data.code == 0 && response.data.isNewUser) {
            showToast("success", "Successful login");
            router.navigate("/newuser");
          } else if (response.data.code == 0 && !response.data.isNewUser) {
            showToast("success", "Successful login");
            router.navigate("/(tabs)/feed");
          } else showToast("Error", "Server Error");
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
      const result = await axios.post(
        `${Constants.expoConfig.extra.SERVER}/sentOTP`,
        { email }
      );
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
      router.navigate("/signin");
    } else {
      showToast("error", "Wrong OTP");
    }
  };

  const handleForgetPassword = () => {
    setIsOtpVisible(false);
    generateOtp();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

            {/* Email input should always be visible */}
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
            </View>

            {!isOtpVisible ? (
              // Password and other login fields should only show if OTP is not visible
              <>
                <View style={styles.inputContainer}>
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
                    onPress={handleGoogleSignIn}
                  >
                    <Text style={styles.googleButtonText}>
                      Continue with &nbsp;
                    </Text>
                    <Ionicons name="logo-google" size={20} color="#6200ee" />
                    {loading && (
                      <ActivityIndicator size="small" color="#6200ee" />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // OTP View
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
                {otpError && <Text style={styles.errorText}>Wrong OTP</Text>}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOtpVerify}
                >
                  <Text style={styles.verifyText}>Verify</Text>
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
  verifyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Font4",
    paddingHorizontal: 10
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
