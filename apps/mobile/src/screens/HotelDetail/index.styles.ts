// import { Dimensions, StyleSheet } from 'react-native';

// const { width } = Dimensions.get('window');

// export const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#F8F9FB' },
    
//     // 沉浸式头部与Banner
//     bannerContainer: { width: width, height: 260 },
//     bannerImage: { width: width, height: 260 },
//     headerOverlay: {
//         position: 'absolute',
//         top: 0, left: 0, right: 0,
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 15,
//         paddingTop: 44, // 适配刘海屏
//         zIndex: 10,
//     },
//     backText: { fontSize: 24, color: '#fff', marginRight: 10 },
//     headerTitle: { fontSize: 18, color: '#fff', fontWeight: '600', flex: 1 },

//     // 信息卡片基础
//     card: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         marginHorizontal: 12,
//         padding: 16,
//         marginTop: -20, // 向上偏移覆盖Banner底部
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 10,
//         elevation: 3,
//     },

//     // 酒店名与星级
//     hotelName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
//     starRow: { flexDirection: 'row', marginTop: 6, alignItems: 'center' },
//     starText: { color: '#FF9500', fontSize: 14, marginRight: 8 },
//     rankingTag: { backgroundColor: '#FFF5E6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
//     rankingText: { color: '#FF9500', fontSize: 12 },

//     // 设施图标
//     facilityContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
//     facilityItem: { alignItems: 'center', width: '20%' },
//     facilityIcon: { fontSize: 20, marginBottom: 4 },
//     facilityName: { fontSize: 11, color: '#666' },

//     // 地址行
//     addressRow: { 
//         flexDirection: 'row', 
//         marginTop: 15, 
//         paddingTop: 15, 
//         borderTopWidth: StyleSheet.hairlineWidth, 
//         borderTopColor: '#EEE' 
//     },
//     addressText: { fontSize: 13, color: '#333', flex: 1, lineHeight: 18 },

//     // 日历卡片
//     calendarCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         marginHorizontal: 12,
//         marginTop: 12,
//         padding: 16,
//     },
//     dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//     dateBox: { flexDirection: 'row', alignItems: 'baseline' },
//     dateLarge: { fontSize: 18, fontWeight: 'bold' },
//     dateSmall: { fontSize: 12, color: '#999', marginLeft: 4 },
//     nightCount: { fontSize: 12, color: '#666', borderBottomWidth: 1, borderBottomColor: '#EEE' },

//     // 房型列表项
//     roomItem: {
//         backgroundColor: '#fff',
//         marginHorizontal: 12,
//         marginTop: 12,
//         borderRadius: 12,
//         flexDirection: 'row',
//         padding: 12,
//     },
//     roomImage: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#F0F0F0' },
//     roomInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
//     roomName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
//     roomSpecs: { fontSize: 12, color: '#999', marginTop: 4 },
//     roomPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
//     priceSymbol: { fontSize: 14, color: '#FF4D4F', fontWeight: 'bold' },
//     priceText: { fontSize: 22, color: '#FF4D4F', fontWeight: 'bold' },
//     bookBtn: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
//     bookBtnText: { color: '#fff', fontWeight: 'bold' }
// });



import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const HEADER_HEIGHT = Platform.OS === 'ios' ? 90 : 70; // 与组件中保持一致

export const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 50 : 20, // 状态栏高度
        zIndex: 100,
    },
    headerLeft: {
        width: 40,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 8,
    },
    backIcon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
    },
    headerRight: {
        width: 40,
    },
    
    
    
  
    // 顶部导航
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 88,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 44,
        zIndex: 100,
    },
    backBtn: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: '300',
    },
    // headerTitle: {
    //     fontSize: 17,
    //     color: '#fff',
    //     fontWeight: '600',
    //     flex: 1,
    //     textAlign: 'center',
    //     marginHorizontal: 10,
    // },
    // headerRight: {
    //     width: 32,
    // },
    // // Banner
    bannerContainer: {
        width: width,
        height: 220,
        position: 'relative',
    },
    bannerImage: {
        width: width,
        height: 280,
        resizeMode: 'cover',
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    indicatorActive: {
        width: 16,
        backgroundColor: '#fff',
    },
    // 酒店信息卡片
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: -5,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    hotelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    hotelName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        backgroundColor: '#FFF5E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 10,
        color: '#FF9500',
        fontWeight: '500',
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    starIcon: {
        color: '#FFB800',
        fontSize: 12,
        marginRight: 2,
    },
    rankingTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5E6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rankingText: {
        fontSize: 11,
        color: '#FF9500',
    },
    rankingArrow: {
        fontSize: 12,
        color: '#FF9500',
        marginLeft: 2,
    },
    // 设施
    facilityContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
    },
    facilityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
    },
    facilityIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    facilityName: {
        fontSize: 12,
        color: '#666',
    },
    // 评分
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F4FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 10,
    },
    ratingScore: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1890FF',
        marginRight: 4,
    },
    ratingLabel: {
        fontSize: 11,
        color: '#1890FF',
        marginRight: 4,
    },
    ratingCount: {
        fontSize: 11,
        color: '#999',
    },
    commentPreview: {
        flex: 1,
    },
    commentText: {
        fontSize: 12,
        color: '#666',
    },
    // 地址
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressContent: {
        flex: 1,
    },
    distanceText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    addressText: {
        fontSize: 12,
        color: '#999',
    },
    mapBtn: {
        alignItems: 'center',
        paddingLeft: 12,
    },
    mapIcon: {
        fontSize: 20,
        marginBottom: 2,
    },
    mapText: {
        fontSize: 11,
        color: '#666',
    },
    // 日历
    calendarCard: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 12,
        padding: 16,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateBox: {
        alignItems: 'center',
    },
    dateLarge: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    dateTag: {
        backgroundColor: '#333',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        marginTop: 4,
    },
    dateTagText: {
        fontSize: 10,
        color: '#fff',
    },
    nightBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nightText: {
        fontSize: 12,
        color: '#666',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#999',
    },
    tipRow: {
        marginTop: 8,
        backgroundColor: '#FFFBE6',
        padding: 8,
        borderRadius: 4,
    },
    tipText: {
        fontSize: 11,
        color: '#D48806',
    },
    filterRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    filterTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
    },
    filterTagText: {
        fontSize: 12,
        color: '#666',
    },
    filterIcon: {
        fontSize: 10,
        marginLeft: 2,
    },
    // 房型列表
    roomListContainer: {
        marginTop: 12,
        paddingHorizontal: 12,
    },
    roomItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        flexDirection: 'row',
        padding: 12,
    },
    roomImage: {
        width: 100,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    roomInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    roomDetail: {
        marginBottom: 8,
    },
    roomName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    roomSpecs: {
        fontSize: 12,
        color: '#999',
    },
    roomPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceBox: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceSymbol: {
        fontSize: 14,
        color: '#FF4D4F',
        fontWeight: '600',
    },
    priceText: {
        fontSize: 24,
        color: '#FF4D4F',
        fontWeight: '700',
    },
    bookBtn: {
        backgroundColor: '#1890FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    bookBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
//     backButton: { width: 30, justifyContent: 'center' },
//  backIcon: { fontSize: 22, color: '#333' },


});