import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Calendar_My from '../../components/Calendar_My';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './index.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelDetail'>;

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

const HotelDetailScreen = ({ route, navigation }: Props) => {
    const { hotelId, hotelName } = route.params;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollY = useRef(new Animated.Value(0)).current;

    // 日历相关状态
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [dateInfo, setDateInfo] = useState(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDisplay = (date: Date) => `${date.getMonth() + 1}月${date.getDate()}日`;
        const formatStr = (date: Date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            startDisplay: formatDisplay(today),
            startStr: formatStr(today),
            endDisplay: formatDisplay(tomorrow),
            endStr: formatStr(tomorrow),
            nights: 1,
        };
    });

    // 模拟酒店图片数据
    const hotelImages = [
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',

    ];

    // 模拟房型数据
    const roomTypes = [
        {
            id: '1',
            name: '经典双床房',
            price: 198,
            specs: '2张1.2米单人床 40㎡',
            img: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80'

        },
        {
            id: '2',
            name: '豪华大床房',
            price: 688,
            specs: '1张1.8米大床 45㎡',
            img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'

        },
        {
            id: '3',
            name: '行政套房',
            price: 2888,
            specs: '1张2.0米特大床 80㎡',
            img: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
        },
    ];

    const sortedRooms = useMemo(() => [...roomTypes].sort((a, b) => a.price - b.price), []);

    // 动画插值
    const headerBackgroundColor = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
        extrapolate: 'clamp',
    });

    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const backIconColor = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: ['#fff', '#333'],
        extrapolate: 'clamp',
    });

    const renderBannerItem = ({ item }: { item: string }) => (
        <Image source={{ uri: item }} style={styles.bannerImage} />
    );

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    );

    const onBannerScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / width);
        if (index >= 0 && index < hotelImages.length && index !== currentImageIndex) {
            setCurrentImageIndex(index);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 顶部导航 - 绝对定位悬浮 */}
            <Animated.View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Animated.Text style={[styles.backIcon, { color: backIconColor }]}>
                            {'<'}
                        </Animated.Text>
                    </TouchableOpacity>
                </View>
                <Animated.Text
                    style={[styles.headerTitle, { opacity: titleOpacity, color: '#333' }]}
                    numberOfLines={1}
                >
                    {hotelName}
                </Animated.Text>
                <View style={styles.headerRight} />
            </Animated.View>

            <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingTop: HEADER_HEIGHT }} // 为其他内容预留导航栏空间
            >
                {/* 大图 Banner - 使用负 marginTop 拉回顶部 */}
                <View style={[styles.bannerContainer, { marginTop: -HEADER_HEIGHT }]}>
                    <FlatList
                        data={hotelImages}
                        renderItem={renderBannerItem}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onBannerScroll}
                        scrollEventThrottle={16}
                    />
                    {/* 图片指示器 */}
                    <View style={styles.indicatorContainer}>
                        {hotelImages.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.indicator,
                                    index === currentImageIndex && styles.indicatorActive
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* 酒店基础信息卡片 */}
                <View style={styles.card}>
                    <View style={styles.hotelHeader}>
                        <Text style={styles.hotelName}>{hotelName}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>口碑榜</Text>
                            <Text style={styles.badgeText}>上榜酒店</Text>
                        </View>
                    </View>

                    <View style={styles.starRow}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Text key={i} style={styles.starIcon}>★</Text>
                            ))}
                        </View>
                        <View style={styles.rankingTag}>
                            <Text style={styles.rankingText}>美景酒店榜 No.4</Text>
                            <Text style={styles.rankingArrow}>›</Text>
                        </View>
                    </View>

                    {/* 设施简述 */}
                    <View style={styles.facilityContainer}>
                        {[
                            { n: '2025年开业', i: '🏢' },
                            { n: '新中式风', i: '🏮' },
                            { n: '免费停车', i: '🅿️' },
                            { n: '设施政策', i: '➡️' },
                        ].map((item, idx) => (
                            <View key={idx} style={styles.facilityItem}>
                                <Text style={styles.facilityIcon}>{item.i}</Text>
                                <Text style={styles.facilityName}>{item.n}</Text>
                            </View>
                        ))}
                    </View>

                    {/* 评分和地址 */}
                    <View style={styles.infoRow}>
                        <View style={styles.ratingBox}>
                            <Text style={styles.ratingScore}>4.8</Text>
                            <Text style={styles.ratingLabel}>超棒</Text>
                            <Text style={styles.ratingCount}>4695条</Text>
                        </View>
                        <View style={styles.commentPreview}>
                            <Text style={styles.commentText}>"中式风格装修，舒适安逸"</Text>
                        </View>
                    </View>

                    {/* 地址 */}
                    <View style={styles.addressRow}>
                        <View style={styles.addressContent}>
                            <Text style={styles.distanceText}>距塘桥地铁站步行1.5公里,约22分钟</Text>
                            <Text style={styles.addressText}>浦东新区浦明路868弄3号楼</Text>
                        </View>
                        <View style={styles.mapBtn}>
                            <Text style={styles.mapIcon}>📍</Text>
                            <Text style={styles.mapText}>地图</Text>
                        </View>
                    </View>
                </View>

                {/* 日历间夜选择 */}
                <TouchableOpacity onPress={() => setCalendarVisible(true)}>
                    <View style={styles.calendarCard}>
                        <View style={styles.dateRow}>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateLarge}>{dateInfo.startDisplay}</Text>
                                <View style={styles.dateTag}>
                                    <Text style={styles.dateTagText}>入住</Text>
                                </View>
                            </View>
                            <View style={styles.nightBadge}>
                                <Text style={styles.nightText}>{dateInfo.nights}晚</Text>
                            </View>
                            <View style={styles.dateBox}>
                                <Text style={styles.dateLarge}>{dateInfo.endDisplay}</Text>
                                <View style={styles.dateTag}>
                                    <Text style={styles.dateTagText}>离店</Text>
                                </View>
                            </View>
                            {/* <Text style={styles.arrowIcon}>›</Text> */}
                        </View>
                        <View style={styles.tipRow}>
                            <Text style={styles.tipText}>点击可修改入离日期</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* 房型价格列表 */}
                <View style={styles.roomListContainer}>
                    {sortedRooms.map((room) => (
                        <TouchableOpacity key={room.id} style={styles.roomItem}>
                            <Image source={{ uri: room.img }} style={styles.roomImage} />
                            <View style={styles.roomInfo}>
                                <View style={styles.roomDetail}>
                                    <Text style={styles.roomName}>{room.name}</Text>
                                    <Text style={styles.roomSpecs}>{room.specs}</Text>
                                </View>
                                <View style={styles.roomPriceRow}>
                                    <View style={styles.priceBox}>
                                        <Text style={styles.priceSymbol}>¥</Text>
                                        <Text style={styles.priceText}>{room.price}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.bookBtn}>
                                        <Text style={styles.bookBtnText}>查看房型</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 50 }} />
            </ScrollView>

            {/* 日历组件 */}
            <Calendar_My
                visible={calendarVisible}
                onClose={() => setCalendarVisible(false)}
                onConfirm={(data) => {
                    setDateInfo({
                        startDisplay: data.startDisplay,
                        startStr: data.startStr,
                        endDisplay: data.endDisplay,
                        endStr: data.endStr,
                        nights: data.nights,
                    });
                    setCalendarVisible(false);
                }}
            />
        </View>
    );
};

export default HotelDetailScreen;