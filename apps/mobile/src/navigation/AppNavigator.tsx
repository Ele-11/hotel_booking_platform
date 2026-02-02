// // import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import React from "react";
// // import HomeScreen from "../screens/HomeScreen";
// // import HotelDetailScreen from "../screens/HotelDetailScreen";
// // import HotelListScreen from "../screens/HotelListScreen";

// export type RootStackParamList = {
//   Home: undefined;
//   HotelList: undefined;
//   HotelDetail: { hotelId: string };
// };

// // const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         headerShown: true,
//         headerStyle: {
//           backgroundColor: "#3b82f6",
//         },
//         headerTintColor: "#fff",
//         headerTitleStyle: {
//           fontWeight: "600",
//         },
//       }}
//     >
//       {/* <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ title: "易宿酒店预订" }}
//       /> */}
//       {/* <Stack.Screen
//         name="HotelList"
//         component={HotelListScreen}
//         options={{ title: "酒店列表" }}
//       />
//       <Stack.Screen
//         name="HotelDetail"
//         component={HotelDetailScreen}
//         options={{ title: "酒店详情" }}
//       /> */}
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;