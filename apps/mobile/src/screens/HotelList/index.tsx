// screens/HotelList/index.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Calendar_My from '../../components/Calendar_My';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './index.styles';

// 导入API
import type { IHotel } from '@hotel-booking-platform/shared-types/src/domain/hotel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FeatureOption, fetchFeatureOptions } from '../../api/feature';
import { fetchHotelList, HotelListParams } from '../../api/hotel';
import { fetchLocationOptions, LocationOption } from '../../api/location';
import { fetchPriceOptions, PriceOption } from '../../api/price';
import { fetchSortOptions, SortOption } from '../../api/sort';

type Props = NativeStackScreenProps<RootStackParamList, 'HotelList'>;

const HotelListScreen = ({ route, navigation }: Props) => {
    // const {
    //     city = '',
    //     startDate = new Date().toISOString().split('T')[0],
    //     endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    //     name = '',
    //     brand = ''
    // } = route.params || {};

    const {
        city = '',
        startDate = new Date().toISOString().split('T')[0],
        endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        name = '',
        brand = '',
        price: initialPrice = '',       // 从首页传来的价格值
        roomType: initialRoomType = ''  // 从首页传来的房型值
    } = route.params || {};

    // 选项数据状态
    const [sortOptions, setSortOptions] = useState<SortOption[]>([]);
    const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
    const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);
    const [featureOptions, setFeatureOptions] = useState<FeatureOption[]>([]);

    // 酒店列表及分页
    const [hotels, setHotels] = useState<IHotel[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    // 实际应用的筛选参数（确认后更新）
    const [appliedFilters, setAppliedFilters] = useState({
        sort: '',
        location: '',
        priceRanges: [] as string[],
        features: [] as string[]
    });

    // 筛选核心状态 - 用户当前选中的值（实际应用的值）
    const [selectedSort, setSelectedSort] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    // 临时状态（用于未确认前的选择）
    const [tempSort, setTempSort] = useState('');
    const [tempLocation, setTempLocation] = useState('');
    const [tempPrice, setTempPrice] = useState<string[]>([]);
    const [tempFeatures, setTempFeatures] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<number | null>(null);

    // 辅助函数：计算晚数
    const calculateNights = (start: string, end: string) => {
        if (!start || !end) return 1;
        const s = new Date(start);
        const e = new Date(end);
        const diff = e.getTime() - s.getTime();
        const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 1;
    };

    // 日期状态
    const [calendarVisible, setCalendarVisible] = useState(false);
    const [dateInfo, setDateInfo] = useState({
        startDisplay: startDate.slice(5).replace('-', '/'),
        startStr: startDate,
        endDisplay: endDate.slice(5).replace('-', '/'),
        endStr: endDate,
        nights: calculateNights(startDate, endDate)
    });

    // 获取筛选选项数据
    // useEffect(() => {
    //     const loadOptions = async () => {
    //         try {
    //             const [sortRes, locRes, priceRes, featureRes] = await Promise.all([
    //                 fetchSortOptions(),
    //                 fetchLocationOptions(),
    //                 fetchPriceOptions(),
    //                 fetchFeatureOptions()
    //             ]);
    //             setSortOptions(sortRes.data.data.options);
    //             setLocationOptions(locRes.data.data.options);
    //             setPriceOptions(priceRes.data.data.options);
    //             setFeatureOptions(featureRes.data.data.options);

    //             // 设置默认选中值（例如第一个选项）
    //             const defaultSort = sortRes.data.data.options[0]?.value || '';
    //             const defaultLoc = locRes.data.data.options[0]?.value || '';

    //             setSelectedSort(defaultSort);
    //             setSelectedLocation(defaultLoc);
    //             setTempSort(defaultSort);
    //             setTempLocation(defaultLoc);

    //             // 关键：设置 appliedFilters 默认值，触发初始加载
    //             setAppliedFilters({
    //                 sort: defaultSort,
    //                 location: defaultLoc,
    //                 priceRanges: [],
    //                 features: []
    //             });
    //         } catch (error) {
    //             console.error('加载筛选选项失败', error);
    //         }
    //     };
    //     loadOptions();
    // }, []);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [sortRes, locRes, priceRes, featureRes] = await Promise.all([
                    fetchSortOptions(),
                    fetchLocationOptions(),
                    fetchPriceOptions(),
                    fetchFeatureOptions()
                ]);
                setSortOptions(sortRes.data.data.options);
                setLocationOptions(locRes.data.data.options);
                setPriceOptions(priceRes.data.data.options);
                setFeatureOptions(featureRes.data.data.options);

                // 设置默认排序和位置
                const defaultSort = sortRes.data.data.options[0]?.value || 'popular';
                // 设置默认位置为"不限"（通常是第一个选项）
                const defaultLoc = locRes.data.data.options.find((opt: any) => opt.label === '不限')?.value ||
                    locRes.data.data.options[0]?.value || 'all';
                console.log('Setting default filters:', { defaultSort, defaultLoc });
                setSelectedSort(defaultSort);
                setSelectedLocation(defaultLoc);
                setTempSort(defaultSort);
                setTempLocation(defaultLoc);

                // 处理从首页传来的价格和房型
                let initialPriceRanges: string[] = [];
                if (initialPrice) {
                    // 将价格值（如 '150-300'）作为价格区间
                    initialPriceRanges = [initialPrice];
                }
                let initialFeatures: string[] = [];
                if (initialRoomType) {
                    // 将房型值（如 '大床房'）作为设施筛选（假设 featureOptions 中有对应）
                    // 注意：featureOptions 的 value 可能与房型名不一致，需要映射
                    // 这里简化处理：如果 featureOptions 中某选项的 label 等于 initialRoomType，则取其 value
                    const matchedFeature = featureRes.data.data.options.find(
                        (f: any) => f.label === initialRoomType
                    );
                    if (matchedFeature) {
                        initialFeatures = [matchedFeature.value];
                    } else {
                        // 如果找不到，可以选择忽略或使用默认值
                        console.warn('未找到对应的房型设施');
                    }
                }

                // 设置临时状态
                setTempPrice(initialPriceRanges);
                setTempFeatures(initialFeatures);

                // 立即应用筛选，触发数据加载
                // 如果没有初始价格和房型，则不设置这些筛选条件
                const newFilters = {
                    sort: defaultSort,
                    location: defaultLoc,
                    priceRanges: initialPriceRanges.length > 0 ? initialPriceRanges : [],
                    features: initialFeatures.length > 0 ? initialFeatures : []
                };
                console.log('Applying initial filters:', newFilters);
                setAppliedFilters(newFilters);

            } catch (error) {
                console.error('加载筛选选项失败', error);
                // ... 错误处理
            }
        };
        loadOptions();
    }, []);


    // 加载酒店列表数据
    const loadHotels = useCallback(async (pageNum: number, isRefresh = false) => {

        if (loading || (!hasMore && !isRefresh)) return;

        setLoading(true);
        console.log('Loading hotels...', pageNum, isRefresh);

        try {
            const params: HotelListParams = {
                sort: appliedFilters.sort,
                location: appliedFilters.location,
                priceRanges: appliedFilters.priceRanges,
                features: appliedFilters.features,
                page: pageNum,
                pageSize: 5,
                city,
                startDate: dateInfo.startStr,
                endDate: dateInfo.endStr,
                nights: dateInfo.nights,
                keyword: name || brand
            };

            const res = await fetchHotelList(params);
            const { list, hasMore: more, total: totalCount } = res.data.data;

            setHotels(prev => isRefresh ? list : [...prev, ...list]);
            setHasMore(more);
            setTotal(totalCount);
            setPage(pageNum);
        } catch (error) {
            console.error('加载酒店列表失败', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [appliedFilters, city, dateInfo, name, brand]);




    // 当 appliedFilters 变化时，重新加载数据（包括初始加载）
    useEffect(() => {
        // 确保至少有基本的筛选条件，但不要过于严格
        // 即使没有筛选条件也要加载数据
        setHotels([]);
        setPage(1);
        setHasMore(true);
        loadHotels(1, true);
    }, [appliedFilters]);

    // 下拉刷新
    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setHasMore(true);
        loadHotels(1, true);
    };

    // 上滑加载更多
    const onEndReached = () => {
        if (hasMore && !loading) {
            loadHotels(page + 1);
        }
    };

    // 处理Tab点击
    const toggleFilterTab = (index: number) => {
        if (activeTab === index) {
            setActiveTab(null);
        } else {
            // 打开面板时，将当前已选值同步到临时状态
            setTempSort(selectedSort);
            setTempLocation(selectedLocation);
            setTempPrice(selectedPriceRanges);
            setTempFeatures(selectedFeatures);
            setActiveTab(index);
        }
    };

    // 处理筛选确认
    const handleConfirm = () => {
        // 将所有临时值应用到实际选中状态
        setSelectedSort(tempSort);
        setSelectedLocation(tempLocation);
        setSelectedPriceRanges(tempPrice);
        setSelectedFeatures(tempFeatures);

        // 更新 appliedFilters 触发重新请求
        setAppliedFilters({
            sort: tempSort,
            location: tempLocation,
            priceRanges: tempPrice,
            features: tempFeatures
        });
        setActiveTab(null);
    };

    // 处理重置
    const handleReset = (type: 'sort' | 'location' | 'price' | 'features') => {
        if (type === 'sort') {
            // 重置为默认值（第一个选项）
            if (sortOptions.length > 0) {
                setTempSort(sortOptions[0].value);
            } else {
                setTempSort('');
            }
        } else if (type === 'location') {
            if (locationOptions.length > 0) {
                setTempLocation(locationOptions[0].value);
            } else {
                setTempLocation('');
            }
        } else if (type === 'price') {
            setTempPrice([]);
        } else if (type === 'features') {
            setTempFeatures([]);
        }
    };

    // 通用多选处理
    const handleMultiSelect = (currentList: string[], value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (currentList.includes(value)) {
            setter(currentList.filter(item => item !== value));
        } else {
            setter([...currentList, value]);
        }
    };

    // 渲染标签网格
    const renderTagGrid = (
        options: { label: string; value: string }[],
        selectedValues: string[],
        onSelect: (val: string) => void
    ) => (
        <View style={styles.tagContainer}>
            {options.map((opt, idx) => {
                const isSelected = selectedValues.includes(opt.value);
                const isLastInRow = (idx + 1) % 3 === 0;
                return (
                    <TouchableOpacity
                        key={opt.value}
                        style={[
                            styles.tagItem,
                            isLastInRow && styles.tagItemNoMargin,
                            isSelected && styles.activeTagItem
                        ]}
                        onPress={() => onSelect(opt.value)}
                    >
                        <Text style={[styles.tagText, isSelected && styles.activeTagText]}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );

    // 渲染下拉内容
    const renderDropdownContent = () => {
        if (activeTab === null) return null;

        let content = null;

        // Tab 0: 排序（带确认按钮）
        if (activeTab === 0) {
            content = (
                <>
                    <ScrollView style={{ maxHeight: 300 }}>
                        <View style={styles.panelContainer}>
                            {sortOptions.map((option) => {
                                const isSelected = tempSort === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.dropdownItem}
                                        onPress={() => setTempSort(option.value)}
                                    >
                                        <Text style={[styles.dropdownItemText, isSelected && styles.activeDropdownItemText]}>
                                            {option.label}
                                        </Text>
                                        {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => handleReset('sort')}>
                            <Text style={styles.resetBtnText}>重置</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmBtnText}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </>
            );
        }
        // Tab 1: 位置（带确认按钮）
        else if (activeTab === 1) {
            content = (
                <>
                    <ScrollView style={{ maxHeight: 300 }}>
                        <View style={styles.panelContainer}>
                            {locationOptions.map((option) => {
                                const isSelected = tempLocation === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.dropdownItem}
                                        onPress={() => setTempLocation(option.value)}
                                    >
                                        <Text style={[styles.dropdownItemText, isSelected && styles.activeDropdownItemText]}>
                                            {option.label}
                                        </Text>
                                        {isSelected && <Text style={styles.checkIcon}>✓</Text>}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => handleReset('location')}>
                            <Text style={styles.resetBtnText}>重置</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmBtnText}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </>
            );
        }
        // Tab 2: 价格（带确认按钮，多选）
        else if (activeTab === 2) {
            content = (
                <>
                    <ScrollView style={{ maxHeight: 300 }}>
                        <View style={styles.panelContainer}>
                            <Text style={styles.sectionTitle}>价格区间</Text>
                            {renderTagGrid(priceOptions, tempPrice, (val) =>
                                handleMultiSelect(tempPrice, val, setTempPrice)
                            )}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => handleReset('price')}>
                            <Text style={styles.resetBtnText}>重置</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmBtnText}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </>
            );
        }
        // Tab 3: 设施（带确认按钮，多选）
        else if (activeTab === 3) {
            content = (
                <>
                    <ScrollView style={{ maxHeight: 300 }}>
                        <View style={styles.panelContainer}>
                            <Text style={styles.sectionTitle}>服务设施</Text>
                            {renderTagGrid(featureOptions, tempFeatures, (val) =>
                                handleMultiSelect(tempFeatures, val, setTempFeatures)
                            )}
                        </View>
                    </ScrollView>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.resetBtn} onPress={() => handleReset('features')}>
                            <Text style={styles.resetBtnText}>重置</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                            <Text style={styles.confirmBtnText}>确认</Text>
                        </TouchableOpacity>
                    </View>
                </>
            );
        }

        return (
            <View style={styles.dropdownContainer}>
                <TouchableWithoutFeedback onPress={() => setActiveTab(null)}>
                    <View style={styles.mask} />
                </TouchableWithoutFeedback>
                <View style={styles.dropdownContent}>
                    {content}
                </View>
            </View>
        );
    };

    // 渲染酒店项
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
                        <Text style={styles.commentText}>{item.comments}评价</Text>
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

    // 获取当前排序和位置的显示文本
    const getSortLabel = () => sortOptions.find(o => o.value === selectedSort)?.label || '排序';
    const getLocationLabel = () => locationOptions.find(o => o.value === selectedLocation)?.label || '位置距离';

    const filterTabs = [
        { label: getSortLabel(), index: 0 },
        { label: getLocationLabel(), index: 1 },
        { label: '价格', index: 2 },
        { label: '筛选', index: 3 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={[styles.headerContainer, { zIndex: 10 }]}>
                {/* 搜索框 */}
                <View style={styles.searchBarContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>{'<'}</Text>
                    </TouchableOpacity>
                    <View style={styles.searchMainContent}>
                        <Text style={styles.cityText}>{city || '上海'}</Text>
                        <TouchableOpacity
                            style={styles.dateVerticalContainer}
                            onPress={() => setCalendarVisible(true)}
                        >
                            <View style={styles.dateInfoColumn}>
                                <View style={styles.dateRow}>
                                    <Text style={styles.dateLabel}>住</Text>
                                    <Text style={styles.dateValue}>{dateInfo.startDisplay}</Text>
                                </View>
                                <View style={styles.dateRow}>
                                    <Text style={styles.dateLabel}>离</Text>
                                    <Text style={styles.dateValue}>{dateInfo.endDisplay}</Text>
                                </View>
                            </View>
                            <Text style={styles.nightCountText}>{dateInfo.nights}晚</Text>
                        </TouchableOpacity>
                        <View style={styles.verticalDivider} />
                        <View style={styles.keywordContainer}>
                            <Text style={styles.searchIcon}>🔍</Text>
                            <TextInput
                                style={styles.keywordPlaceholder}
                                placeholderTextColor="#ccc"
                                placeholder="位置/品牌/酒店"
                            />
                        </View>
                    </View>
                </View>

                <Calendar_My
                    visible={calendarVisible}
                    onClose={() => setCalendarVisible(false)}
                    onConfirm={(data) => {
                        setDateInfo(data);
                        setCalendarVisible(false);
                    }}
                />

                {/* 筛选Tab */}
                <View style={styles.filterRow}>
                    {filterTabs.map((item) => {
                        const isActive = activeTab === item.index;
                        // 判断是否有非默认值（用于高亮）
                        let hasValue = false;
                        if (item.index === 0 && sortOptions.length > 0) {
                            const defaultSort = sortOptions[0].value;
                            hasValue = selectedSort !== defaultSort;
                        } else if (item.index === 1 && locationOptions.length > 0) {
                            const defaultLoc = locationOptions[0].value;
                            hasValue = selectedLocation !== defaultLoc;
                        } else if (item.index === 2) {
                            hasValue = selectedPriceRanges.length > 0;
                        } else if (item.index === 3) {
                            hasValue = selectedFeatures.length > 0;
                        }

                        return (
                            <TouchableOpacity
                                key={item.index}
                                style={styles.filterItem}
                                onPress={() => toggleFilterTab(item.index)}
                            >
                                <Text style={[styles.filterText, (isActive || hasValue) && styles.activeFilterText]}>
                                    {item.label}
                                </Text>
                                <Text style={[styles.arrowIcon, isActive && styles.activeArrowIcon]}>
                                    {isActive ? '▲' : '▼'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {renderDropdownContent()}
            </View>

            <FlatList
                data={hotels}
                renderItem={renderHotelItem}
                keyExtractor={item => item.id}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.2}
                onRefresh={onRefresh}
                refreshing={refreshing}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    loading && !refreshing ? (
                        <View style={styles.footerLoading}>
                            <ActivityIndicator color="#007AFF" />
                        </View>
                    ) : (
                        <View style={{ height: 20 }} />
                    )
                }
            />
        </SafeAreaView>
    );
};

export default HotelListScreen;