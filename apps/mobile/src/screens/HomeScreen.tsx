// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../navigation/AppNavigator";
// import Icon from "react-native-vector-icons/Ionicons";

// type HomeScreenNavigationProp = NativeStackNavigationProp<
//   RootStackParamList,
//   "Home"
// >;

// const HomeScreen = () => {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const [searchQuery, setSearchQuery] = React.useState("");
//   const [checkInDate, setCheckInDate] = React.useState("");
//   const [checkOutDate, setCheckOutDate] = React.useState("");
//   const [guests, setGuests] = React.useState("2");

//   const handleSearch = () => {
//     navigation.navigate("HotelList", {
//       // 传递搜索参数
//     });
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>寻找完美住宿</Text>
//         <Text style={styles.subtitle}>在全球范围内预订酒店、度假屋等</Text>
//       </View>

//       <View style={styles.searchCard}>
//         <View style={styles.searchField}>
//           <Icon name="location-outline" size={20} color="#666" />
//           <TextInput
//             style={styles.input}
//             placeholder="目的地、城市或酒店名称"
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         <View style={styles.dateRow}>
//           <View style={styles.dateField}>
//             <Icon name="calendar-outline" size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               placeholder="入住日期"
//               value={checkInDate}
//               onChangeText={setCheckInDate}
//             />
//           </View>
//           <View style={styles.dateField}>
//             <Icon name="calendar-outline" size={20} color="#666" />
//             <TextInput
//               style={styles.input}
//               placeholder="离店日期"
//               value={checkOutDate}
//               onChangeText={setCheckOutDate}
//             />
//           </View>
//         </View>

//         <View style={styles.searchField}>
//           <Icon name="people-outline" size={20} color="#666" />
//           <TextInput
//             style={styles.input}
//             placeholder="入住人数"
//             value={guests}
//             onChangeText={setGuests}
//             keyboardType="numeric"
//           />
//         </View>

//         <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
//           <Icon name="search" size={20} color="#fff" />
//           <Text style={styles.searchButtonText}>搜索酒店</Text>
//         </TouchableOpacity>
//       </View>

//       {/* <View style={styles.section}>
//         <Text style={styles.sectionTitle">热门目的地</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {[
//             { name: "北京", hotels: 245 },
//             { name: "上海", hotels: 189 },
//             { name: "广州", hotels: 156 },
//             { name: "深圳", hotels: 132 },
//             { name: "成都", hotels: 98 },
//           ].map((city) => (
//             <TouchableOpacity key={city.name} style={styles.cityCard}>
//               <View style={styles.cityImage} />
//               <Text style={styles.cityName}>{city.name}</Text>
//               <Text style={styles.cityHotels}>{city.hotels}家酒店</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View> */}

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle">推荐酒店</Text>
//         {[1, 2, 3].map((item) => (
//           <TouchableOpacity
//             key={item}
//             style={styles.hotelCard}
//             onPress={() => navigation.navigate("HotelDetail", { hotelId: "1" })}
//           >
//             <View style={styles.hotelImage} />
//             <View style={styles.hotelInfo}>
//               <Text style={styles.hotelName}>豪华大酒店 {item}</Text>
//               <Text style={styles.hotelLocation}>北京市中心</Text>
//               <View style={styles.hotelRating}>
//                 <Icon name="star" size={16} color="#f59e0b" />
//                 <Text style={styles.ratingText}>4.8</Text>
//                 <Text style={styles.reviewsText}>(128评价)</Text>
//               </View>
//               <Text style={styles.hotelPrice}>¥ 599/晚</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },
//   header: {
//     padding: 20,
//     paddingTop: 40,
//     backgroundColor: "#3b82f6",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#dbeafe",
//   },
//   searchCard: {
//     margin: 20,
//     marginTop: -40,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   searchField: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f1f5f9",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     marginBottom: 16,
//   },
//   input: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: "#1e293b",
//   },
//   dateRow: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   dateField: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f1f5f9",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   searchButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#3b82f6",
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginTop: 8,
//   },
//   searchButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   section: {
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: 16,
//   },
//   cityCard: {
//     width: 120,
//     marginRight: 16,
//   },
//   cityImage: {
//     width: 120,
//     height: 120,
//     backgroundColor: "#cbd5e1",
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   cityName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: 4,
//   },
//   cityHotels: {
//     fontSize: 14,
//     color: "#64748b",
//   },
//   hotelCard: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     marginBottom: 16,
//     padding: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   hotelImage: {
//     width: 100,
//     height: 100,
//     backgroundColor: "#cbd5e1",
//     borderRadius: 8,
//   },
//   hotelInfo: {
//     flex: 1,
//     marginLeft: 12,
//     justifyContent: "space-between",
//   },
//   hotelName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1e293b",
//   },
//   hotelLocation: {
//     fontSize: 14,
//     color: "#64748b",
//     marginTop: 2,
//   },
//   hotelRating: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 4,
//   },
//   ratingText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginLeft: 4,
//   },
//   reviewsText: {
//     fontSize: 12,
//     color: "#94a3b8",
//     marginLeft: 4,
//   },
//   hotelPrice: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#3b82f6",
//     marginTop: 4,
//   },
// });

// export default HomeScreen;