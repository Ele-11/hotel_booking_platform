import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F7',
    },
    // 顶部核心筛选头容器
    headerContainer: {
        backgroundColor: '#fff',
        paddingBottom: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEE',
    },
    // 整合了返回键、城市、日期的搜索框
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        marginHorizontal: 15,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 10,
    },
    backIcon: {
        fontSize: 24,
        color: '#333',
        marginRight: 10,
    },
    cityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 15,
    },
    dateInfo: {
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: '#DDD',
        paddingLeft: 12,
        justifyContent: 'center',
    },
    dateRangeText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    nightText: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    searchIcon: {
        fontSize: 18,
        color: '#007AFF',
        marginLeft: 10,
    },
    // 详细筛选横向排列
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
    },
    arrowIcon: {
        fontSize: 10,
        marginLeft: 4,
        color: '#999',
    },
    // 酒店列表卡片
    hotelItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 16,
        padding: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    hotelImage: {
        width: 120,
        height: 150,
        borderRadius: 12,
    },
    infoArea: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    hotelName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 15,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 8,
    },
    addressText: {
        fontSize: 12,
        color: '#999',
        marginTop: 6,
    },
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    hotelTag: {
        backgroundColor: '#E8F3FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 4,
    },
    hotelTagText: {
        fontSize: 11,
        color: '#007AFF',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    priceSymbol: {
        fontSize: 14,
        color: '#FF5A5F',
        fontWeight: 'bold',
        marginBottom: 3,
    },
    priceText: {
        fontSize: 24,
        color: '#FF5A5F',
        fontWeight: 'bold',
    },
    priceUnit: {
        fontSize: 13,
        color: '#999',
        marginLeft: 2,
        marginBottom: 4,
    },
    footerLoading: {
        paddingVertical: 30,
        alignItems: 'center',
    }
});