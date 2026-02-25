import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';


import { getCurrentCitySimplified } from '../../utils/location';
// 导入第三方数据包
import citiesRaw from 'china-division/dist/cities.json';
import provincesRaw from 'china-division/dist/provinces.json';

import Calendar_My from '../../components/Calendar_My';
import { RootStackParamList } from '../../navigation/types';


import { styles, width } from './index.styles';


// 省份列表
const provinceList = provincesRaw.map(p => ({ label: p.name, value: p.name }));

// 城市映射（省份名 -> 城市对象数组）
const cityMap: Record<string, { label: string; value: string }[]> = {};
provincesRaw.forEach(p => {
    const matchedCities = citiesRaw
        .filter(c => c.provinceCode === p.code)
        .map(c => ({ label: c.name, value: c.name }));
    cityMap[p.name] = matchedCities;
});

const FILTER_DATA = {
    prices: [
        { label: '不限', value: '' },
        { label: '￥0-150', value: '0-150' },
        { label: '￥150-300', value: '150-300' },
        { label: '￥300-600', value: '300-600' },
        { label: '￥600-1000', value: '600-1000' },
        { label: '￥1000以上', value: '1000-99999' }
    ],
    roomTypes: [
        { label: '不限', value: '' },
        { label: '大床房', value: '大床房' },
        { label: '双床房', value: '双床房' },
        { label: '单人床', value: '单人床' },
        { label: '三人间', value: '三人间' },
        { label: '套房', value: '套房' }
    ]
};

// const BANNERS = [
//     { id: '1', title: '春季特惠：三亚海景房 5 折起', uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800' },
//     { id: '2', title: '深山避暑：莫干山精品民宿', uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800' },
//     { id: '3', title: '魔都之夜：上海外滩景观房', uri: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800' },
//     { id: '4', title: '古城韵味：大理洱海阳光房', uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800' },
//     { id: '5', title: '亲子时光：长隆主题酒店', uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800' },
// ];

const BANNERS = [
    {
        id: '1',
        hotelName: '三亚海景度假酒店',
        title: '春季特惠：三亚海景房 5 折起',
        uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
    },
    {
        id: '2',
        hotelName: '莫干山精品民宿',
        title: '深山避暑：莫干山精品民宿',
        uri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
    },
    {
        id: '3',
        hotelName: '上海外滩景观酒店',
        title: '魔都之夜：上海外滩景观房',
        uri: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=800'
    },
    {
        id: '4',
        hotelName: '大理洱海阳光客栈',
        title: '古城韵味：大理洱海阳光房',
        uri: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'
    },
    {
        id: '5',
        hotelName: '广州长隆主题酒店',
        title: '亲子时光：长隆主题酒店',
        uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    },
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
        startDisplay: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace('.', '/').replace('.', ''),
        startWeek: new Date().toLocaleDateString('zh-CN', { weekday: 'short' }),
        startStr: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace('.', '-').replace('.', ''),
        endDisplay: (new Date(Date.now() + 24 * 60 * 60 * 1000)).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace('.', '/').replace('.', ''),
        endWeek: new Date().toLocaleDateString('zh-CN', { weekday: 'short' }),
        endStr: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace('.', '-').replace('.', ''),
        nights: 1
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
    // 定位按钮点击事件
    const handleLocationPress = async () => {
        setIsLoading(true);
        try {
            const AMAP_KEY = '3164f44f2c88fa71022b2c1f5784deac';
            // 调用工具函数
            const cityResult = await getCurrentCitySimplified(AMAP_KEY);

            if (cityResult) {
                const [province, city] = cityResult;
                setProvince(province);
                setCity(city);
                Alert.alert('定位成功', `当前位置：${province} ${city}`);
            }
        } catch (e) {
            Alert.alert('定位出错', '请检查网络或定位权限');
        } finally {
            setIsLoading(false);
        }
    };

    // // --- 3. 选择器逻辑 ---
    // const openPicker = (type: typeof pickingType) => {
    //     setPickingType(type);
    //     setModalVisible(true);
    // };


    // // 选择器点击时，存储对应的 value
    // const handleSelect = (item: { label: string; value: string }) => {
    //     if (pickingType === 'price') {
    //         setPrice(item.value);
    //     } else if (pickingType === 'roomType') {
    //         setRoomType(item.value);
    //     }
    //     setModalVisible(false);
    // };

    // // 修改 getModalData 返回带 value 的数据
    // const getModalData = () => {
    //     if (pickingType === 'price') return FILTER_DATA.prices;
    //     if (pickingType === 'roomType') return FILTER_DATA.roomTypes;
    //     // 其他保持不变
    //     if (pickingType === 'province') return provinceList;
    //     if (pickingType === 'city') return cityMap[province] || [];
    //     return [];
    // };



    // 选择器打开函数（不变）
    const openPicker = (type: typeof pickingType) => {
        setPickingType(type);
        setModalVisible(true);
    };

    // 修改 handleSelect，接收对象参数
    const handleSelect = (item: { label: string; value: string }) => {
        if (pickingType === 'province') {
            setProvince(item.value);
            // 选择省份后，默认选中该省份的第一个城市
            if (cityMap[item.value] && cityMap[item.value].length > 0) {
                setCity(cityMap[item.value][0].value);
            }
        } else if (pickingType === 'city') {
            setCity(item.value);
        } else if (pickingType === 'price') {
            setPrice(item.value);
        } else if (pickingType === 'roomType') {
            setRoomType(item.value);
        }
        setModalVisible(false);
    };

    // getModalData 现在统一返回对象数组
    const getModalData = () => {
        if (pickingType === 'province') return provinceList;
        if (pickingType === 'city') return cityMap[province] || [];
        if (pickingType === 'price') return FILTER_DATA.prices;
        if (pickingType === 'roomType') return FILTER_DATA.roomTypes;
        return [];
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
                            onPress={() => navigation.navigate('HotelDetail',
                                {
                                    hotelId: banner.id,
                                    hotelName: banner.hotelName   // 传入酒店名称
                                }
                            )}
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
                        city,
                        province,
                        price,          // 现在是值，如 '150-300'
                        roomType,       // 现在是值，如 '大床房'
                        startDate: dateInfo.startStr,
                        endDate: dateInfo.endStr
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
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => handleSelect(item)}>
                                    <Text style={styles.modalItemText}>{item.label}</Text>
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