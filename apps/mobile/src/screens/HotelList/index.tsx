import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './index.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelList'>;

interface IHotel {
    id: string;
    name: string;
    image: string;
    score: number;
    comments: number;
    address: string;
    tags: string[];
    price: number;
}

const HotelListScreen = ({ route, navigation }: Props) => {
    // 获取首页传递的参数
    const { city = '北京2222', startDate = '05-01222', endDate = '05-03222' } = route.params || {};

    const [hotels, setHotels] = useState<IHotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    // 模拟数据加载
    const loadData = (isRefresh = false) => {
        if (loading) return;
        setLoading(true);

        setTimeout(() => {
            const mockData: IHotel[] = Array.from({ length: 5 }).map((_, i) => ({
                id: Math.random().toString(),
                name: `${city}嘉悦豪华酒店 ${isRefresh ? i + 1 : hotels.length + i + 1}号店`,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
                score: 4.8,
                comments: 1200,
                address: '海淀区中关村大街15号 | 距您直线2.3km',
                tags: ['免费停车', '极速WiFi', '欢迎水果'],
                price: 588 + (isRefresh ? i : hotels.length + i) * 10,
            }));

            setHotels(prev => isRefresh ? mockData : [...prev, ...mockData]);
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        loadData(true);
    }, []);

    const renderHotelItem = ({ item }: { item: IHotel }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.hotelItem}
            onPress={() => navigation.navigate('HotelDetail', { hotelId: item.id, hotelName: item.name })}
        >
            <Image source={{ uri: item.image }} style={styles.hotelImage} />
            <View style={styles.infoArea}>
                <View>
                    <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreText}>{item.score}分</Text>
                        <Text style={styles.commentText}>{item.comments}条点评</Text>
                    </View>
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                    <View style={styles.tagRow}>
                        {item.tags.map((tag, idx) => (
                            <View key={idx} style={styles.hotelTag}>
                                <Text style={styles.hotelTagText}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceSymbol}>¥</Text>
                    <Text style={styles.priceText}>{item.price}</Text>
                    <Text style={styles.priceUnit}>起</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* 1. 顶部自定义搜索头 */}
            <View style={styles.headerContainer}>
                <View style={styles.searchBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>{'<'}</Text>
                    </TouchableOpacity>

                    <Text style={styles.cityText}>{city}</Text>

                    <View style={styles.dateInfo}>
                        <Text style={styles.dateRangeText}>{startDate} - {endDate}</Text>
                        <Text style={styles.nightText}>共2晚</Text>
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.searchIcon}>🔍</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. 筛选Tab栏 */}
                <View style={styles.filterRow}>
                    {[
                        { label: '欢迎度排序', active: true },
                        { label: '位置距离', active: false },
                        { label: '价格/星级', active: false },
                        { label: '筛选', active: false }
                    ].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.filterItem}>
                            <Text style={[styles.filterText, item.active && { color: '#333', fontWeight: 'bold' }]}>
                                {item.label}
                            </Text>
                            <Text style={styles.arrowIcon}>▼</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* 3. 酒店列表 */}
            <FlatList
                data={hotels}
                renderItem={renderHotelItem}
                keyExtractor={item => item.id}
                onEndReached={() => loadData()} // 上滑自动加载
                onEndReachedThreshold={0.2}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    loading ? (
                        <View style={styles.footerLoading}>
                            <ActivityIndicator color="#007AFF" />
                        </View>
                    ) : <View style={{ height: 20 }} />
                }
            />
        </SafeAreaView>
    );
};

export default HotelListScreen;