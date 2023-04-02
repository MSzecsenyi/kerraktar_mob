import React, { useState } from "react";
import {
    Button,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { DateRange, LoginDrawerProps } from "../../interfaces";
import BottomControlButtons from "./BottomControlButtons";
import BottomCheckButton from "../atoms/BottomCheckButton";
import HeaderWithSearchBar from "../pages/HeaderWithSearchBar";

interface DateSelectorProps {
    dateRange: DateRange;
    setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
    setDateIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
    drawerProps: LoginDrawerProps;
}

const DateSelector = ({
    dateRange,
    setDateRange,
    setDateIsSelected,
    drawerProps,
}: DateSelectorProps) => {
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const onStartDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        const currentDate = selectedDate || dateRange.startDate;
        setShowStartPicker(Platform.OS === "ios");
        setStartDate(currentDate);
    };
    const onEndDateChange = (
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        const currentDate = selectedDate || dateRange.endDate;
        setShowEndPicker(Platform.OS === "ios");
        setEndDate(currentDate);
    };

    const initialEndDate =
        dateRange.startDate > dateRange.endDate
            ? dateRange.startDate
            : dateRange.endDate;

    const setStartDate = (date: Date) =>
        setDateRange({ ...dateRange, startDate: date });
    const setEndDate = (date: Date) =>
        setDateRange({ ...dateRange, endDate: date });

    return (
        <>
            <HeaderWithSearchBar drawerProps={drawerProps} />
            <View style={styles.container}>
                {/* start date picker */}

                {Platform.OS === "android" && (
                    <TouchableHighlight
                        style={styles.dateSelectorButton}
                        onPress={() => setShowStartPicker(true)}
                    >
                        <Text
                            style={styles.dateSelectorButtonText}
                        >{`StartDate: ${dateRange.startDate.getFullYear()}.${
                            dateRange.startDate.getMonth() + 1
                        }.${dateRange.startDate.getDate()}`}</Text>
                    </TouchableHighlight>
                )}
                {(showStartPicker || Platform.OS === "ios") && (
                    <DateTimePicker
                        value={dateRange.startDate}
                        minimumDate={new Date()}
                        onChange={onStartDateChange}
                    ></DateTimePicker>
                )}

                {/* end date picker */}

                {Platform.OS === "android" && (
                    <TouchableHighlight
                        style={styles.dateSelectorButton}
                        onPress={() => setShowEndPicker(true)}
                    >
                        <Text
                            style={styles.dateSelectorButtonText}
                        >{`EndDate: ${dateRange.endDate.getFullYear()}.${
                            dateRange.endDate.getMonth() + 1
                        }.${dateRange.endDate.getDate()}`}</Text>
                    </TouchableHighlight>
                )}
                {(showEndPicker || Platform.OS === "ios") && (
                    <DateTimePicker
                        value={initialEndDate}
                        minimumDate={dateRange.startDate}
                        onChange={onEndDateChange}
                    ></DateTimePicker>
                )}
                <BottomControlButtons>
                    <BottomCheckButton
                        acceptButtonIsActive={
                            dateRange.endDate >= dateRange.startDate
                        }
                        acceptButtonOnPress={() => setDateIsSelected(true)}
                    />
                </BottomControlButtons>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 8,
    },
    dateSelectorButton: {
        padding: 10,
        margin: 5,
        height: 70,
        borderRadius: 15,
        backgroundColor: "green",
        flexDirection: "row",
        justifyContent: "center",
    },
    dateSelectorButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
});

export default DateSelector;
