import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // 在 export const styles = StyleSheet.create({ ... }) 中添加：
    // 胶囊搜索框主体 - 关键：flex: 1 保证它不超出屏幕
//     searchMainContent: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#F2F4F7', 
//         borderRadius: 25,          
//         paddingHorizontal: 12,
//         paddingVertical: 4,
//     },
    dateVerticalContainer: {
        flexDirection: 'row', // 让日期列和晚数横向排列
        alignItems: 'center',
        marginRight: 8,
        paddingLeft: 4,
    },
    dateInfoColumn: {
        flexDirection: 'column', // 住和离上下排列
        justifyContent: 'center',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1, // 压缩行间距
    },
    dateLabel: {
        fontSize: 10,
        color: '#999',
        marginRight: 4,
    },
    dateValue: {
        fontSize: 11,
        color: '#0086F6', // 携程蓝
        fontWeight: '600',
    },
    nightCountText: {
        fontSize: 10,
        color: '#666',
        marginLeft: 6, // 晚数跟在日期右侧
        paddingLeft: 6,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: '#DDD', // 加个小竖线分隔
    },
    starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
},
scoreText: {
    fontSize: 14,
    color: '#0086F6', // 携程蓝
    fontWeight: 'bold',
    // marginLeft: 6,
},
    // starRow: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginTop: 4,
    // },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    // scoreText: {
    //     fontSize: 14,
    //     color: '#0086F6',
    //     fontWeight: 'bold',
    //     marginLeft: 8, // 留出一点距离给星星
    // },
    commentText: {
        marginLeft: 120,
        fontSize: 12,
        color: '#666',
    },

    // 如果你还在用 Text 字符，可以加个阴影让它更立体
    starIcon: {
        fontSize: 14,
        color: '#FFB400', // 携程常用的金橙色
        marginRight: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F6F7',
    },
    // --- 顶部 Header ---
    headerContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#EEE',
        // zIndex 在组件中动态设置
        position: 'relative',
    },
    // --- 搜索条 ---
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    backButton: { width: 30, justifyContent: 'center' },
    backIcon: { fontSize: 22, color: '#333' },

    cityText: { fontSize: 15, fontWeight: 'bold', color: '#333', marginRight: 8 },
    // dateVerticalContainer: { marginRight: 6, justifyContent: 'center' },
    // dateRow: { flexDirection: 'row', alignItems: 'center' },
    // dateLabel: { fontSize: 9, color: '#999', marginRight: 2 },
    // dateValue: { fontSize: 10, color: '#3388FF', fontWeight: '500' },
    // nightCountText: { fontSize: 10, color: '#666', marginRight: 8 },
    verticalDivider: { width: 1, height: 14, backgroundColor: '#DDD', marginRight: 8 },
//     keywordContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    

    searchMainContent: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F2F4F7', 
        borderRadius: 35,          

        paddingVertical: 4,
  // 如果有 padding，确保不压缩内部空间
},

keywordContainer: {
  flex: 1,                 // 占据剩余所有空间
  flexDirection: 'row',
  alignItems: 'center',
  // 可设置最小宽度防止被挤压
  minWidth: 80,
  // 背景色等保持不变
},

keywordPlaceholder: {
  flex: 1,                 // 输入框填满容器
  fontSize: 13,
  paddingVertical: 3,
  // 移除固定的 width 或设置 width: null
},


    searchIcon: { fontSize: 16, marginRight: 4 },
//     keywordPlaceholder: { fontSize: 13, color: '#333',backgroundColor: '#F2F4F7', flex: 1,padding: 0 },

    // --- 筛选栏 Tab ---
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5'
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, 
    },
    filterText: {
        fontSize: 13,
        color: '#666',
    },
    activeFilterText: {
        color: '#0086F6', // 携程蓝
        fontWeight: 'bold',
    },
    arrowIcon: {
        fontSize: 10,
        marginLeft: 4,
        color: '#999',
    },
    activeArrowIcon: {
        color: '#0086F6',
    },

    // --- 下拉菜单容器 ---
    dropdownContainer: {
        position: 'absolute',
        top: '100%', 
        left: 0,
        right: 0,
        height: height, 
        zIndex: 100,
    },
    mask: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dropdownContent: {
        backgroundColor: '#fff',
        width: '100%',
        maxHeight: height * 0.7, // 最多占屏幕70%
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        overflow: 'hidden',
    },

    // --- 下拉菜单通用列表项 (单选) ---
    dropdownList: {
        paddingVertical: 5,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: { fontSize: 14, color: '#333' },
    activeDropdownItemText: { color: '#0086F6', fontWeight: 'bold' },
    checkIcon: { color: '#0086F6', fontSize: 16 },

    // --- 复杂筛选面板 (Price/Star, Filter) ---
    panelContainer: {
        padding: 15,
        paddingBottom: 0,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        marginTop: 5,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 15,
    },
    // 标签样式
    tagItem: {
        width: '31%', // 一行三个
        backgroundColor: '#F5F5F5',
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginRight: '3.5%', // 间距
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tagItemNoMargin: {
        marginRight: 0,
    },
    activeTagItem: {
        backgroundColor: '#EAF6FF',
        borderColor: '#0086F6',
    },
    tagText: {
        fontSize: 12,
        color: '#666',
    },
    activeTagText: {
        color: '#0086F6',
        fontWeight: 'bold',
    },

    // --- 底部确认/重置按钮栏 ---
    buttonGroup: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        padding: 10,
        backgroundColor: '#fff',
    },
    resetBtn: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 4,
        paddingVertical: 10,
        alignItems: 'center',
        marginRight: 10,
    },
    resetBtnText: {
        color: '#666',
        fontSize: 14,
    },
    confirmBtn: {
        flex: 2, // 确认按钮大一点
        backgroundColor: '#0086F6',
        borderRadius: 4,
        paddingVertical: 10,
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // --- 空状态样式 ---
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    resetButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // --- 酒店列表卡片 ---
    hotelItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    hotelImage: { width: 100, height: 130, borderRadius: 8 },
    infoArea: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
    hotelName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    addressText: { fontSize: 12, color: '#999', marginTop: 4 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
    hotelTag: { backgroundColor: '#E8F3FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 6, marginBottom: 4 },
    hotelTagText: { fontSize: 10, color: '#007AFF' },
    priceContainer: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end' },
    priceSymbol: { fontSize: 12, color: '#FF5A5F', fontWeight: 'bold' },
    priceText: { fontSize: 20, color: '#FF5A5F', fontWeight: 'bold' },
    priceUnit: { fontSize: 11, color: '#999', marginLeft: 2 },
    footerLoading: { paddingVertical: 20, alignItems: 'center' }
});