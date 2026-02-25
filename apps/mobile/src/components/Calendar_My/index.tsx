import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { styles } from './index.styles';

// 工具函数
const getWeekDay = (dateString: string): string => {
    const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weeks[new Date(dateString).getDay()];
};

const formatDateDisplay = (dateString: string): string => {
    const [_, m, d] = dateString.split('-');
    return `${m}月${d}日`;
};

const getOneYearLaterDate = (): string => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + 1);
    return now.toISOString().split('T')[0];
};

// 类型定义
export interface CalendarConfirmData {
    startStr: string;
    startDisplay: string;
    startWeek: string;
    endStr: string;
    endDisplay: string;
    endWeek: string;
    nights: number;
}

interface CalendarProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (data: CalendarConfirmData) => void;
}

interface MarkedDateItem {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
    selected?: boolean;
    selectedColor?: string;
    disableTouchEvent?: boolean;
}

type MarkedDates = Record<string, MarkedDateItem>;

const Calendar_My = ({ visible, onClose, onConfirm }: CalendarProps) => {
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const minDate = new Date().toISOString().split('T')[0];
    const maxDate = getOneYearLaterDate();

    // 生成标记日期 - 使用useMemo优化
    const markedDates = useMemo(() => {
        const newMarked: MarkedDates = {};

        if (!startDate) return newMarked;

        if (!endDate) {
            return {
                [startDate]: {
                    startingDay: true,
                    endingDay: true,
                    color: '#007AFF',
                    textColor: 'white',
                    selected: true
                }
            };
        }

        let curr = new Date(startDate);
        const end = new Date(endDate);

        while (curr <= end) {
            const str = curr.toISOString().split('T')[0];
            if (str === startDate) {
                newMarked[str] = {
                    startingDay: true,
                    color: '#007AFF',
                    textColor: 'white',
                    disableTouchEvent: true
                };
            } else if (str === endDate) {
                newMarked[str] = {
                    endingDay: true,
                    color: '#007AFF',
                    textColor: 'white',
                    disableTouchEvent: true
                };
            } else {
                newMarked[str] = {
                    color: '#EAF2FF',
                    textColor: '#007AFF',
                    disableTouchEvent: true
                };
            }
            curr.setDate(curr.getDate() + 1);
        }
        return newMarked;
    }, [startDate, endDate]);

    // 日期点击逻辑
    const onDayPress = useCallback((day: { dateString: string }) => {
        const dateString = day.dateString;

        if (!startDate || (startDate && endDate)) {
            setStartDate(dateString);
            setEndDate('');
            return;
        }

        if (dateString <= startDate) {
            setStartDate(dateString);
            setEndDate('');
            return;
        }

        setEndDate(dateString);

        const end = new Date(dateString);
        const nights = Math.ceil(
            (end.getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        // 延迟确认，让用户看到选中的范围
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
    }, [startDate, endDate, onConfirm]);

    // 月份切换
    const onMonthChange = useCallback((month: { dateString: string }) => {
        setCurrentMonth(new Date(month.dateString));
    }, []);

    // 切换到上个月
    const goToPreviousMonth = useCallback(() => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
    }, [currentMonth]);

    // 切换到下个月
    const goToNextMonth = useCallback(() => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
    }, [currentMonth]);

    // 自定义日期渲染 - 使用useCallback避免重复创建
    const renderDay = useCallback(({ date, state }: any) => {
        const isSelected = markedDates[date.dateString];
        const isToday = state === 'today';
        const isDisabled = state === 'disabled';

        let dayStyle = styles.dayCell;
        let dayTextStyle = styles.dayText;

        if (isDisabled) {
            dayTextStyle = styles.disabledDayText;
        } else if (isSelected) {
            if (isSelected.startingDay && isSelected.endingDay) {
                dayStyle = styles.singleSelectedDay;
            } else if (isSelected.startingDay) {
                dayStyle = styles.startDay;
            } else if (isSelected.endingDay) {
                dayStyle = styles.endDay;
            } else {
                dayStyle = styles.middleDay;
            }
            dayTextStyle = styles.selectedDayText;
        } else if (isToday) {
            dayTextStyle = styles.todayText;
        }

        return (
            <TouchableOpacity
                style={dayStyle}
                onPress={() => onDayPress(date)}
                disabled={isDisabled}
                activeOpacity={0.7}
            >
                <Text style={dayTextStyle}>{date.day}</Text>
            </TouchableOpacity>
        );
    }, [markedDates, onDayPress]);

    // 自定义头部
    const renderCustomHeader = useCallback((date: Date) => {
        const weekTitles = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return (
            <View style={styles.calendarHeaderWrapper}>
                {/* 月份标题 + 左右箭头 */}
                <View style={styles.monthRow}>
                    <TouchableOpacity
                        style={styles.arrowBtn}
                        onPress={goToPreviousMonth}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.arrowText}>👈</Text>
                    </TouchableOpacity>
                    <Text style={styles.calendarMonthTitle}>
                        {date.getFullYear()}年{date.getMonth() + 1}月
                    </Text>
                    <TouchableOpacity
                        style={styles.arrowBtn}
                        onPress={goToNextMonth}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.arrowText}>👉</Text>
                    </TouchableOpacity>
                </View>
                {/* 中文星期行 */}
                <View style={styles.weekDaysContainer}>
                    {weekTitles.map((title) => (
                        <Text key={title} style={styles.weekDayText}>
                            {title}
                        </Text>
                    ))}
                </View>
            </View>
        );
    }, [goToPreviousMonth, goToNextMonth]);

    // 重置状态
    const handleClose = useCallback(() => {
        setStartDate('');
        setEndDate('');
        setCurrentMonth(new Date());
        onClose();
    }, [onClose]);

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={[styles.modalContainer, { paddingTop: Platform.OS === 'ios' ? 50 : 20 }]}>
                {/* 弹窗头部 */}
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Text style={styles.cancelText}>取消</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>选择入离日期</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* 日历核心 */}
                <Calendar
                    key={`calendar-${currentMonth.toISOString()}`}
                    current={currentMonth.toISOString().split('T')[0]}
                    markingType={'period'}
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    onMonthChange={onMonthChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    // 自定义头部
                    renderHeader={renderCustomHeader}
                    // 隐藏默认头部
                    hideArrows={true}
                    hideExtraDays={false}
                    // 使用自定义日期渲染
                    dayComponent={renderDay}
                    // 主题配置
                    theme={{
                        // 箭头相关
                        arrowColor: '#007AFF',
                        arrowStyle: { display: 'none' },
                        // 月份标题
                        monthTextColor: '#333',
                        textMonthFontSize: 18,
                        textMonthFontWeight: '600',
                        // 日期样式
                        dayTextColor: '#333',
                        textDayFontSize: 16,
                        textDayStyle: { color: '#333' },
                        // 选中的日期
                        selectedDayBackgroundColor: '#007AFF',
                        selectedDayTextColor: '#fff',
                        // 今天的日期
                        todayTextColor: '#007AFF',
                        todayBackgroundColor: 'transparent',
                        // 禁用日期
                        textDisabledColor: '#ccc',
                        // 样式覆盖
                        'stylesheet.calendar.header': {
                            header: {
                                flexDirection: 'column',
                                backgroundColor: '#fff',
                                marginTop: 10,
                                marginBottom: 10
                            },
                            monthText: {
                                display: 'none'
                            },
                            arrow: {
                                display: 'none'
                            },
                            dayHeader: {
                                display: 'none'
                            }
                        },
                        'stylesheet.calendar.main': {
                            week: {
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                marginVertical: 4
                            },
                            dayContainer: {
                                flex: 1,
                                alignItems: 'center'
                            }
                        }
                    }}
                />

                {/* 底部确认信息 */}
                {startDate && endDate && (
                    <View style={styles.selectedInfo}>
                        <Text style={styles.selectedText}>
                            已选择: {formatDateDisplay(startDate)} - {formatDateDisplay(endDate)}
                            ({Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))}晚)
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
};

export default Calendar_My;