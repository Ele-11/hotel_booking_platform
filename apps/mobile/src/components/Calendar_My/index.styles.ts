import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    cancelText: {
        fontSize: 16,
        color: '#666'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    // 日历头部
    calendarHeaderWrapper: {
        marginLeft:0,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 10
    },
    monthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12
    },
    arrowBtn: {
        padding: 8,
        minWidth: 40,
        alignItems: 'center'
    },
    arrowText: {
        fontSize: 20,
        color: '#007AFF',
        fontWeight: '500'
    },
    calendarMonthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    weekDayText: {
        width: (width - 32) / 7,
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        fontWeight: '500'
    },
    // 日期单元格样式
    dayCell: {
        width: (width - 32) / 7,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dayText: {
        fontSize: 16,
        color: '#333'
    },
    disabledDayText: {
        fontSize: 16,
        color: '#ccc'
    },
    todayText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500'
    },
    selectedDayText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500'
    },
    singleSelectedDay: {
        width: (width - 32) / 7,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderRadius: 22
    },
    startDay: {
        width: (width - 32) / 7,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderTopLeftRadius: 22,
        borderBottomLeftRadius: 22
    },
    endDay: {
        width: (width - 32) / 7,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        borderTopRightRadius: 22,
        borderBottomRightRadius: 22
    },
    middleDay: {
        width: (width - 32) / 7,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAF2FF'
    },
    // 底部选中信息
    selectedInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        alignItems: 'center'
    },
    selectedText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '500'
    }
});