import React, { useEffect, useState } from "react";
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { StringDateRange } from "../../interfaces";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomButton from "../atoms/bottomButtons/BottomButton";
import BottomButtonContainer from "../atoms/bottomButtons/BottomButtonContainer";
import { dateToStr, displayDate } from "../../functions";
import { COLORS } from "../../colors";

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
		// if (currentDate > dateRange.endDate) {
		// 	setEndDate(currentDate);
		// }
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
				<Text style={styles.titleText}>Válassz időtartamot:</Text>
				{/* start date picker */}
				<Text style={styles.subtitleText}>Kezdő dátum:</Text>
				{Platform.OS === "android" && (
					<TouchableOpacity
						style={styles.dateSelectorButton}
						onPress={() => setShowStartPicker(true)}>
						<Text style={styles.dateSelectorButtonText}>
							{displayDate(dateRange.startDate)}
						</Text>
					</TouchableOpacity>
				)}
				{(showStartPicker || Platform.OS === "ios") && (
					<DateTimePicker
						value={dateRange.startDate}
						minimumDate={new Date()}
						mode="date"
						display={Platform.OS === "android" ? "default" : "spinner"}
						locale="hu-HU"
						negativeButtonLabel="Mégse"
						onChange={onStartDateChange}></DateTimePicker>
				)}

				{/* end date picker */}

				<Text style={styles.subtitleText}>Záró dátum:</Text>
				{Platform.OS === "android" && (
					<TouchableOpacity
						style={styles.dateSelectorButton}
						onPress={() => setShowEndPicker(true)}>
						<Text style={styles.dateSelectorButtonText}>
							{displayDate(dateRange.endDate)}
						</Text>
					</TouchableOpacity>
				)}
				{(showEndPicker || Platform.OS === "ios") && (
					<DateTimePicker
						value={initialEndDate}
						mode="date"
						display={Platform.OS === "android" ? "default" : "spinner"}
						locale="hu-HU"
						negativeButtonLabel="Mégse"
						minimumDate={dateRange.startDate}
						onChange={onEndDateChange}
					/>
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
		padding: 8,
	},
	titleText: {
		marginTop: "20%",
		marginBottom: 30,
		fontSize: 24,
		textAlign: "center",
	},
	subtitleText: {
		textAlign: "center",
		paddingTop: 25,
		paddingBottom: 5,
		fontWeight: "bold",
		fontSize: 16,
	},
	dateSelectorButton: {
		padding: 10,
		marginHorizontal: 50,
		height: 70,
		borderRadius: 15,
		backgroundColor: COLORS.mainColor,
		justifyContent: "center",
		alignItems: "center",
	},
	dateSelectorButtonText: {
		fontSize: 18,
		fontWeight: "bold",
		color: COLORS.white,
	},
});

export default DateSelector;
