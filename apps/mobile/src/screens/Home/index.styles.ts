import { Dimensions, StyleSheet } from 'react-native';
export const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // 添加或覆盖这些样式
dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
},
dateBox: {
    flex: 1,
},
dateLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
},
dateInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
},
dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
},
dateWeek: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 4,
},
nightCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
},
nightLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
},
nightBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
},
nightText: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
},
    bannerContainer: {
        width: width,
        height: 180,
        position: 'relative', // 为了让指示点绝对定位在底部
    },
    bannerImage: {
        width: width, // 确保图片撑满屏幕宽
        height: '100%',
    },
    // ... bannerMask 和 bannerTitle 保持你原来的 ...

    // 新增指示点样式
    pagination: {
        position: 'absolute',
        bottom: 10,
        right: 15,
        flexDirection: 'row',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginLeft: 5,
    },
    activeDot: {
        backgroundColor: '#fff',
        width: 12, // 选中的点稍微长一点，更好看
    },
    // Modal 相关样式
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end', // 弹窗从底部弹出
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        height: '50%', // 弹窗高度占屏幕一半
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modalItem: {
        paddingVertical: 15,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f5f5f5',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    tagItem: {
        backgroundColor: '#f2f2f2', // 默认灰色背景
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'transparent', // 预留边框位置防止抖动
    },
    // 新增：选中后的常亮背景样式
    tagItemActive: {
        backgroundColor: '#E6F0FF', // 淡蓝色背景
        borderColor: '#007AFF',     // 蓝色边框
    },
    tagText: { 
        fontSize: 12, 
        color: '#666' 
    },
    // 新增：选中后的文字颜色
    tagTextActive: {
        color: '#007AFF',           // 蓝色文字
        fontWeight: '600',
    },

    
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'space-between', // 确保横向撑开
    },
    // 新增：用于包裹省、市的每一个单元格
    locationItem: {
        flex: 1, // 关键：三个部分平分空间
        justifyContent: 'center',
    },
    locationBtn: {
        flex: 1, // 关键：定位按钮也占 1/3
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // 居中显示定位图标和文字
        borderLeftWidth: 1,
        borderLeftColor: '#eee',
    },
    locationIcon: { 
        fontSize: 16, 
        marginRight: 4 
    },
    locationText: { 
        color: '#007AFF', 
        fontWeight: '500' 
    },
    
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    // bannerContainer: {
    //     width: width,
    //     height: 180,
    // },
    // bannerImage: {
    //     width: '100%',
    //     height: '100%',
    // },
    bannerMask: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    searchCard: {
        margin: 15,
        marginTop: -5,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    // locationRow: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     paddingVertical: 10,
    // },
    // locationBtn: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     borderLeftWidth: 1,
    //     borderLeftColor: '#eee',
    //     paddingLeft: 10,
    // },
    // locationIcon: { fontSize: 16, marginRight: 4 },
    // locationText: { color: '#007AFF', fontWeight: '500' },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    dateText: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 4 },
    weekText: { fontSize: 12, fontWeight: 'normal', color: '#999' },
    // nightBadge: {
    //     borderWidth: 1,
    //     borderColor: '#eee',
    //     borderRadius: 10,
    //     paddingHorizontal: 8,
    //     height: 20,
    //     justifyContent: 'center',
    // },
    // nightText: { fontSize: 10, color: '#666' },
    searchInput: {
        fontSize: 16,
        padding: 0,
        marginTop: 4,
        color: '#333',
        fontWeight: '500',
    },
    tagScroll: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
        marginTop: 15,
    },
    // tagItem: {
    //     backgroundColor: '#f2f2f2',
    //     paddingHorizontal: 12,
    //     paddingVertical: 6,
    //     borderRadius: 4,
    //     marginRight: 8,
    // },
    // tagText: { fontSize: 12, color: '#666' },
    searchItem: { paddingVertical: 12 },
    label: { fontSize: 12, color: '#999' },
    searchValue: { fontSize: 16, fontWeight: '600', color: '#333', marginTop: 4 },
    divider: { height: 1, backgroundColor: '#f0f0f0' },
    searchButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    searchButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    infoSection: { alignItems: 'center', marginVertical: 20 },
    infoText: { color: '#ccc', fontSize: 12 }
});