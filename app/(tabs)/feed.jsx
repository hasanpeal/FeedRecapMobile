import { View, Text } from "react-native";
import React from "react";
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from "react-native-safe-area-context";

export default function feed() {
  return (
    <SafeAreaView>
      <View>
        <Text style={{ fontFamily: "PassionOne-Regular" }}> Wassip </Text>
      </View>
    </SafeAreaView>
  );
}
