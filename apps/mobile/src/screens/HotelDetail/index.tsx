import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Image, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './index.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelDetail'>;

const HotelDetailScreen = ({ route, navigation }: Props) => {
    const { hotelId, hotelName } = route.params;

    // 模拟房型数据 (增加图片和详细规格)
    const roomTypes = [
        { id: '1', name: '经典双床房', price: 936, specs: '2张1.2米单人床 | 40m² | 2人入住', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
        { id: '2', name: '豪华大床房', price: 1280, specs: '1张1.8米大床 | 45m² | 2人入住', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
        { id: '3', name: '行政套房', price: 2560, specs: '1张2.0米特大床 | 80m² | 2人入住', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' },
    ];

    // 逻辑：按价格从低到高排序
    const sortedRooms = useMemo(() => {
        return [...roomTypes].sort((a, b) => a.price - b.price);
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 1. 顶部导航 (沉浸式) */}
            <View style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{hotelName}</Text>
            </View>

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                {/* 2. 大图 Banner */}
                <View style={styles.bannerContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' }}
                        style={styles.bannerImage}
                    />
                </View>

                {/* 3. 酒店基础信息卡片 */}
                <View style={styles.card}>
                    <Text style={styles.hotelName}>{hotelName}</Text>
                    <View style={styles.starRow}>
                        <Text style={styles.starText}>⭐⭐⭐⭐⭐</Text>
                        <View style={styles.rankingTag}>
                            <Text style={styles.rankingText}>上海美景酒店榜 No.16 〉</Text>
                        </View>
                    </View>

                    {/* 设施简述 */}
                    <View style={styles.facilityContainer}>
                        {[
                            { n: '2020年开业', i: '🏢' },
                            { n: '新中式风', i: '🏮' },
                            { n: '免费停车', i: '🅿️' },
                            { n: '一线江景', i: '🌊' },
                            { n: '设施政策', i: '➡️' },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.facilityItem}>
                                <Text style={styles.facilityIcon}>{item.i}</Text>
                                <Text style={styles.facilityName}>{item.n}</Text>
                            </View>
                        ))}
                    </View>

                    {/* 地址 */}
                    <View style={styles.addressRow}>
                        <Text style={styles.addressText}>浦东新区浦明路868弄3号楼 · 距塘桥地铁站步行1.5公里</Text>
                    </View>
                </View>

                {/* 4. 日历间夜选择 */}
                <View style={styles.calendarCard}>
                    <View style={styles.dateRow}>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLarge}>1月9日</Text>
                            <Text style={styles.dateSmall}>今天</Text>
                        </View>
                        <Text style={styles.nightCount}>1晚</Text>
                        <View style={styles.dateBox}>
                            <Text style={styles.dateLarge}>1月10日</Text>
                            <Text style={styles.dateSmall}>明天</Text>
                        </View>
                        <Text style={{ color: '#999' }}>〉</Text>
                    </View>
                </View>

                {/* 5. 房型价格列表 */}
                {sortedRooms.map((room) => (
                    <TouchableOpacity key={room.id} style={styles.roomItem}>
                        <Image source={{ uri: room.img }} style={styles.roomImage} />
                        <View style={styles.roomInfo}>
                            <View>
                                <Text style={styles.roomName}>{room.name}</Text>
                                <Text style={styles.roomSpecs}>{room.specs}</Text>
                            </View>
                            <View style={styles.roomPriceRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                    <Text style={styles.priceSymbol}>￥</Text>
                                    <Text style={styles.priceText}>{room.price}</Text>
                                    <Text style={{ fontSize: 12, color: '#999' }}> 起</Text>
                                </View>
                                <View style={styles.bookBtn}>
                                    <Text style={styles.bookBtnText}>预订</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

export default HotelDetailScreen;