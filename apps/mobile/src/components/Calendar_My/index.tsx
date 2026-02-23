import React, { useState } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './index.styles';
// 如果 Web 端依然报错，尝试在 Calendar_My 顶部加这一行

// 辅助函数保持不变...
const getWeekDay = (dateString: string) => {
    const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weeks[new Date(dateString).getDay()];
};

const formatDateDisplay = (dateString: string) => {
    const [_, m, d] = dateString.split('-');
    return `${m}月${d}日`;
};

interface CalendarProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

const Calendar_My = ({ visible, onClose, onConfirm }: CalendarProps) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [markedDates, setMarkedDates] = useState<any>({});

    const onDayPress = (day: any) => {
        const dateString = day.dateString;
        if (!startDate || (startDate && endDate)) {
            setStartDate(dateString);
            setEndDate('');
            setMarkedDates({
                [dateString]: { startingDay: true, color: '#007AFF', textColor: 'white' }
            });
        } else {
            if (dateString <= startDate) {
                setStartDate(dateString);
                setEndDate('');
                setMarkedDates({
                    [dateString]: { startingDay: true, color: '#007AFF', textColor: 'white' }
                });
                return;
            }

            setEndDate(dateString);
            const newMarked: any = {};
            let curr = new Date(startDate);
            const end = new Date(dateString);

            while (curr <= end) {
                const str = curr.toISOString().split('T')[0];
                if (str === startDate) {
                    newMarked[str] = { startingDay: true, color: '#007AFF', textColor: 'white' };
                } else if (str === dateString) {
                    newMarked[str] = { endingDay: true, color: '#007AFF', textColor: 'white' };
                } else {
                    newMarked[str] = { color: '#EAF2FF', textColor: '#007AFF' };
                }
                curr.setDate(curr.getDate() + 1);
            }
            setMarkedDates(newMarked);

            const nights = Math.ceil((end.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

            setTimeout(() => {
                onConfirm({
                    startStr: startDate,
                    startDisplay: formatDateDisplay(startDate),
                    startWeek: getWeekDay(startDate),
                    endStr: dateString,
                    endDisplay: formatDateDisplay(dateString),
                    endWeek: getWeekDay(dateString),
                    nights
                });
            }, 300);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            {/* 这里的样式应用了 Platform 逻辑，且修正了导出 */}
            <View style={[styles.modalContainer, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancelText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>选择入离日期</Text>
                    <View style={{ width: 40 }} />
                </View>

                <Calendar
                    markingType={'period'}
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    minDate={new Date().toISOString().split('T')[0]}
                    theme={{
                        selectedDayBackgroundColor: '#007AFF',
                        todayTextColor: '#007AFF',
                        arrowColor: '#007AFF',
                        'stylesheet.calendar.header': {
                            week: {
                                marginTop: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }
                        }
                    }}
                />
                <View style={styles.footerInfo}>
                    <Text style={styles.footerText}>请选择入住和离店日期</Text>
                </View>
            </View>
        </Modal>
    );
};

export default Calendar_My;