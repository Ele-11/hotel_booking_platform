import Geolocation from '@react-native-community/geolocation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    PermissionsAndroid,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// 导入第三方数据包
import citiesRaw from 'china-division/dist/cities.json';
import provincesRaw from 'china-division/dist/provinces.json';

import Calendar_My from '../../components/Calendar_My'; // 确保路径正确
import { RootStackParamList } from '../../navigation/types';

// import Calendar_My from '.../components/Calendar_My';
import { styles, width } from './index.styles';

// --- 数据预处理 ---
const provinceList = provincesRaw.map(p => p.name);
const cityMap: Record<string, string[]> = {};
provincesRaw.forEach(p => {
    const matchedCities = citiesRaw.filter(c => c.provinceCode === p.code).map(c => c.name);
    cityMap[p.name] = matchedCities;
});

const FILTER_DATA = {
    prices: ['不限', '￥0-150', '￥150-300', '￥300-600', '￥600-1000', '￥1000以上'],
    roomTypes: ['不限', '大床房', '双人建筑', '单人床', '三人间', '套房']
};

const BANNERS = [
    { id: '1', title: '春季特惠：三亚海景房 5 折起', uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
    { id: '2', title: '深山避暑：莫干山精品民宿', uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
    { id: '3', title: '魔都之夜：上海外滩景观房', uri: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800' },
    { id: '4', title: '古城韵味：大理洱海阳光房', uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' },
    { id: '5', title: '亲子时光：长隆主题酒店', uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
    // --- 状态管理 ---
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // 搜索表单状态
    const [province, setProvince] = useState('广东省');
    const [city, setCity] = useState('珠海市');
    const [price, setPrice] = useState('￥150-300');
    const [roomType, setRoomType] = useState('大床房');
    const [searchKeyWordValue, setSearchKeyWordValue] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 日期状态
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [dateInfo, setDateInfo] = useState({
        startDisplay: '02月03日',
        startWeek: '周二',
        startStr: '2026-02-03',
        endDisplay: '02月05日',
        endWeek: '周四',
        endStr: '2026-02-05',
        nights: 2
    });

    // 选择器控制
    const [modalVisible, setModalVisible] = useState(false);
    const [pickingType, setPickingType] = useState<'province' | 'city' | 'price' | 'roomType'>('province');



    // --- 自动播放逻辑 ---
    // 1. 修改 useEffect 里的自动播放逻辑
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prevIndex) => {
                let nextIndex = prevIndex + 1;
                if (nextIndex >= BANNERS.length) {
                    nextIndex = 0;
                }
                // 确保 scrollRef 存在再执行
                scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
                return nextIndex;
            });
        }, 5000);

        return () => clearInterval(timer);
    }, []); // 注意：这里去掉 [activeIndex] 依赖，避免重复设置定时器

    // --- 手动滑动时更新圆点 ---
    //  修改滑动监听：使用 onScroll 代替 onMomentumScrollEnd 实现秒级同步
    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        // 使用更灵敏的计算方式
        const index = Math.round(offsetX / width);

        // 只有当索引真的改变时才更新 state，防止重复渲染
        if (index >= 0 && index < BANNERS.length && index !== activeIndex) {
            setActiveIndex(index);
        }
    };
    // --- 2. 定位逻辑 ---
    const handleLocationPress = async () => {
        setIsLoading(true);
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert("权限拒绝", "请开启定位权限");
                setIsLoading(false);
                return;
            }
        }
        Geolocation.getCurrentPosition(async (pos) => {
            try {
                let { longitude, latitude } = pos.coords;
                if (__DEV__ && longitude === 116.341431) {
                    longitude = 115.85; // 默认经度
                    latitude = 28.68;   // 默认纬度
                }
                const AMAP_KEY = '3164f44f2c88fa71022b2c1f5784deac'; // dxy申请的高德web的位置api-key
                const url = `https://restapi.amap.com/v3/geocode/regeo?location=${pos.coords.longitude},${pos.coords.latitude}&key=${AMAP_KEY}`;
                const res = await (await fetch(url)).json();
                if (res.status === '1') {
                    const comp = res.regeocode.addressComponent;
                    setProvince("江西省");
                    setCity("南昌市");
                }

            } catch (e) { Alert.alert("网络错误"); }
            finally {
                setIsLoading(false);
                console.log(pos.coords);
            }
        }, () => setIsLoading(false), { timeout: 3000 });
    };

    // --- 3. 选择器逻辑 ---
    const openPicker = (type: typeof pickingType) => {
        setPickingType(type);
        setModalVisible(true);
    };

    const handleSelect = (item: string) => {
        if (pickingType === 'province') {
            setProvince(item);
            setCity(cityMap[item][0] || item);
        } else if (pickingType === 'city') setCity(item);
        else if (pickingType === 'price') setPrice(item);
        else if (pickingType === 'roomType') setRoomType(item);
        setModalVisible(false);
    };

    const getModalData = () => {
        if (pickingType === 'province') return provinceList;
        if (pickingType === 'city') return cityMap[province] || [];
        if (pickingType === 'price') return FILTER_DATA.prices;
        return FILTER_DATA.roomTypes;
    };

    // --- 渲染部分 ---
    return (
        <ScrollView style={styles.container} bounces={false}>

            {/* 1. 轮播图 */}
            {/* 1. 顶部轮播图区域 */}
            <View style={styles.bannerContainer}>
                {/* <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll} // 手动滑动回调
                    bounces={false}
                > */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    // 关键：scrollEventThrottle 设为 16 确保高频同步
                    scrollEventThrottle={16}
                    onScroll={handleScroll}
                    // 移除 onMomentumScrollEnd，全部交给 onScroll 处理
                    bounces={true} // 允许弹性，解决“划不动”的僵硬感
                >
                    {BANNERS.map((banner) => (
                        <TouchableOpacity
                            key={banner.id}
                            activeOpacity={0.9}
                            onPress={() => navigation.navigate('HotelDetail', { hotelId: banner.id })}
                            style={{ width: width, height: 180 }}
                        >
                            <Image source={{ uri: banner.uri }} style={styles.bannerImage} />
                            <View style={styles.bannerMask}>
                                <Text style={styles.bannerTitle}>{banner.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* 指示点区域 */}
                <View style={styles.pagination}>
                    {BANNERS.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                activeIndex === i && styles.activeDot // 当索引匹配时应用高亮样式
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* 2. 查询卡片 */}
            <View style={styles.searchCard}>
                {/* 城市定位 */}
                <View style={styles.locationRow}>
                    <TouchableOpacity style={styles.locationItem} onPress={() => openPicker('province')}>
                        <Text style={styles.label}>省份</Text>
                        <Text style={styles.searchValue}>{province} ▾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locationItem} onPress={() => openPicker('city')}>
                        <Text style={styles.label}>城市</Text>
                        <Text style={styles.searchValue}>{city} ▾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locationBtn} onPress={handleLocationPress} disabled={isLoading}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText}>{isLoading ? '定位中' : '我的位置'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                {/* 关键字 */}
                <View style={styles.searchItem}>
                    <Text style={styles.label}>位置/品牌/酒店</Text>
                    <TextInput
                        placeholder="搜索你想去的地点"
                        placeholderTextColor="#ccc"
                        style={styles.searchInput}
                        value={searchKeyWordValue}
                        onChangeText={setSearchKeyWordValue}
                    />
                </View>

                <View style={styles.divider} />

                {/* 日期选择区域 */}
                <TouchableOpacity style={styles.dateContainer} onPress={() => setCalendarVisible(true)}>
                    {/* 左侧：入住 */}
                    <View style={styles.dateBox}>
                        <Text style={styles.dateLabel}>入住</Text>
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateDay}>{dateInfo.startDisplay.replace('月', '/').replace('日', '')}</Text>
                            <Text style={styles.dateWeek}>{dateInfo.startWeek}</Text>
                        </View>
                    </View>

                    {/* 中间：晚数徽章 */}
                    <View style={styles.nightCenter}>
                        <View style={styles.nightLine} />
                        <View style={styles.nightBadge}>
                            <Text style={styles.nightText}>{dateInfo.nights}晚</Text>
                        </View>
                        <View style={styles.nightLine} />
                    </View>

                    {/* 右侧：离店 */}
                    <View style={[styles.dateBox, { alignItems: 'flex-end' }]}>
                        <Text style={styles.dateLabel}>离店</Text>
                        <View style={styles.dateInfo}>
                            <Text style={styles.dateWeek}>{dateInfo.endWeek}</Text>
                            <Text style={styles.dateDay}>{dateInfo.endDisplay.replace('月', '/').replace('日', '')}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={styles.divider} />

                {/* 价格房型 */}
                <View style={styles.locationRow}>
                    <TouchableOpacity style={styles.locationItem} onPress={() => openPicker('price')}>
                        <Text style={styles.label}>价格</Text>
                        <Text style={styles.searchValue}>{price} ▾</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.locationItem} onPress={() => openPicker('roomType')}>
                        <Text style={styles.label}>房型</Text>
                        <Text style={styles.searchValue}>{roomType} ▾</Text>
                    </TouchableOpacity>
                </View>

                {/* 标签 */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
                    {['豪华酒店', '免费停车场', '含早餐', '近地铁', '温泉酒店'].map((tag) => (
                        <TouchableOpacity
                            key={tag}
                            style={[styles.tagItem, selectedTags.includes(tag) && styles.tagItemActive]}
                            onPress={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                        >
                            <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* 查询按钮 */}
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => navigation.navigate('HotelList', {
                        city, province, price, roomType,
                        startDate: dateInfo.startStr, endDate: dateInfo.endStr
                    })}
                >
                    <Text style={styles.searchButtonText}>查询酒店</Text>
                </TouchableOpacity>
            </View>

            {/* 通用 Modal 选择器 */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>请选择</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{ color: '#999' }}>取消</Text></TouchableOpacity>
                        </View>
                        <FlatList
                            data={getModalData()}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelect(item)}>
                                    <Text style={styles.modalItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* 日历组件 */}
            <Calendar_My
                visible={calendarVisible}
                onClose={() => setCalendarVisible(false)}
                onConfirm={(data) => { setDateInfo(data); setCalendarVisible(false); }}
            />
        </ScrollView>
    );
};

export default HomeScreen;