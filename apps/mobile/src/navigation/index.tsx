import {
    createNativeStackNavigator,
    NativeStackScreenProps // 导入这个
} from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from './types';


import HomeScreen from '../screens/Home';
import HotelDetailScreen from '../screens/HotelDetail/index';
import HotelListScreen from '../screens/HotelList/index';
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerBackTitle: '返回',
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: '首页', headerShown: false
                }} // 这行会彻底隐藏整个顶部导航栏
            />
            <Stack.Screen
                name="HotelList"
                component={HotelListScreen}
                options={{ title: '酒店列表', headerShown: false }}
            />
            <Stack.Screen
                name="HotelDetail"
                component={HotelDetailScreen}
                // 关键修复点：显式为 route 注解类型 👇
                options={({ route }: NativeStackScreenProps<RootStackParamList, 'HotelDetail'>) => ({
                    title: route.params?.hotelName || '酒店详情', headerShown: false
                })}
            />
        </Stack.Navigator>
    );
};