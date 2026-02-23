import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FB' },
    
    // 沉浸式头部与Banner
    bannerContainer: { width: width, height: 260 },
    bannerImage: { width: width, height: 260 },
    headerOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 44, // 适配刘海屏
        zIndex: 10,
    },
    backText: { fontSize: 24, color: '#fff', marginRight: 10 },
    headerTitle: { fontSize: 18, color: '#fff', fontWeight: '600', flex: 1 },

    // 信息卡片基础
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 12,
        padding: 16,
        marginTop: -20, // 向上偏移覆盖Banner底部
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },

    // 酒店名与星级
    hotelName: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    starRow: { flexDirection: 'row', marginTop: 6, alignItems: 'center' },
    starText: { color: '#FF9500', fontSize: 14, marginRight: 8 },
    rankingTag: { backgroundColor: '#FFF5E6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    rankingText: { color: '#FF9500', fontSize: 12 },

    // 设施图标
    facilityContainer: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
    facilityItem: { alignItems: 'center', width: '20%' },
    facilityIcon: { fontSize: 20, marginBottom: 4 },
    facilityName: { fontSize: 11, color: '#666' },

    // 地址行
    addressRow: { 
        flexDirection: 'row', 
        marginTop: 15, 
        paddingTop: 15, 
        borderTopWidth: StyleSheet.hairlineWidth, 
        borderTopColor: '#EEE' 
    },
    addressText: { fontSize: 13, color: '#333', flex: 1, lineHeight: 18 },

    // 日历卡片
    calendarCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 12,
        marginTop: 12,
        padding: 16,
    },
    dateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    dateBox: { flexDirection: 'row', alignItems: 'baseline' },
    dateLarge: { fontSize: 18, fontWeight: 'bold' },
    dateSmall: { fontSize: 12, color: '#999', marginLeft: 4 },
    nightCount: { fontSize: 12, color: '#666', borderBottomWidth: 1, borderBottomColor: '#EEE' },

    // 房型列表项
    roomItem: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 12,
        flexDirection: 'row',
        padding: 12,
    },
    roomImage: { width: 100, height: 100, borderRadius: 8, backgroundColor: '#F0F0F0' },
    roomInfo: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    roomName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    roomSpecs: { fontSize: 12, color: '#999', marginTop: 4 },
    roomPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    priceSymbol: { fontSize: 14, color: '#FF4D4F', fontWeight: 'bold' },
    priceText: { fontSize: 22, color: '#FF4D4F', fontWeight: 'bold' },
    bookBtn: { backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
    bookBtnText: { color: '#fff', fontWeight: 'bold' }
});