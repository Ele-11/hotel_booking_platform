import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    // Modal 全屏容器
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // 自定义头部
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    // 取消/关闭文字
    cancelText: {
        color: '#666',
        fontSize: 16,
    },
    // 日历底部的操作说明（可选）
    footerInfo: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    }
});