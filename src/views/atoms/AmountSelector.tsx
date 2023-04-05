import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";

interface AmountSelectorProps {
    maxAmount: number;
    selectedAmount: number;
    onValueChange: (itemValue: number, itemIndex: number) => void;
}

export default function AmountSelector({
    maxAmount,
    selectedAmount,
    onValueChange,
}: AmountSelectorProps) {
    return (
        <Picker
            selectedValue={selectedAmount}
            onValueChange={onValueChange}
            style={styles.picker}
            mode="dropdown">
            {Array.from({ length: maxAmount }, (_, i) => i).map((value) => (
                <Picker.Item
                    key={value + 1}
                    label={(value + 1).toString()}
                    value={value + 1}
                />
            ))}
        </Picker>
    );
}

const styles = StyleSheet.create({
    picker: {
        width: 35,
    },
});
