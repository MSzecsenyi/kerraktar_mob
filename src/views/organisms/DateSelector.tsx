import React, { useEffect, useState } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} from "react-native";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { StringDateRange } from "../../interfaces";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomButton from "../atoms/bottomButtons/BottomButton";
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";

export const dateToStr = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

interface DateSelectorProps {
	stringDateRange: StringDateRange;
	setStringDateRange: React.Dispatch<React.SetStateAction<StringDateRange>>;
	setDateIsSelected: React.Dispatch<React.SetStateAction<boolean>>;
	openDrawer: () => void;
}

const DateSelector = ({
	stringDateRange,
	setStringDateRange,
	setDateIsSelected,
	openDrawer,
}: DateSelectorProps) => {
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [dateRange, setDateRange] = useState({
		startDate: new Date(),
		endDate: new Date(),
	});

	useEffect(() => {
		setStringDateRange({
			startDate: dateToStr(new Date()),
			endDate: dateToStr(new Date()),
		});
	}, []);

	const onStartDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date
	) => {
		const currentDate = selectedDate || dateRange.startDate;
		setShowStartPicker(Platform.OS === "ios");
		setStartDate(currentDate);
	};
	const onEndDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
		const currentDate = selectedDate || dateRange.endDate;
		setShowEndPicker(Platform.OS === "ios");
		setEndDate(currentDate);
	};

	const initialEndDate =
		dateRange.startDate > dateRange.endDate
			? dateRange.startDate
			: dateRange.endDate;

	const setStartDate = (date: Date) => {
		setDateRange({ ...dateRange, startDate: date });
		setStringDateRange({ ...stringDateRange, startDate: dateToStr(date) });
	};
	const setEndDate = (date: Date) => {
		setDateRange({ ...dateRange, endDate: date });
		setStringDateRange({ ...stringDateRange, endDate: dateToStr(date) });
	};

	return (
		<>
			<HeaderWithSearchBar openDrawer={openDrawer} />
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
				<BottomButtonContainer>
					<BottomButton //Accept changes
						buttonIsActive={
							stringDateRange.endDate >= stringDateRange.startDate
						}
						buttonOnPress={() => setDateIsSelected(true)}
					/>
				</BottomButtonContainer>
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
