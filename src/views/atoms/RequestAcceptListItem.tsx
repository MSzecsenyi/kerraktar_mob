import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { RequestItem } from "../../interfaces";

interface RequestAcceptListItemProps {
    ListItemData: ListRenderItemInfo<RequestItem>;
}

const RequestAcceptListItem = ({
    ListItemData,
}: RequestAcceptListItemProps) => {
    const item = ListItemData.item;
    return (
        <View
            style={
                ListItemData.index % 2 == 0
                    ? styles.itemContainerEven
                    : styles.itemContainerOdd
            }>
            <View style={styles.mainNameContainter}>
                <Text>{item.item_name}</Text>
                <Text>{item.selected_amount}</Text>
            </View>
        </View>
    );
};

export default RequestAcceptListItem;

const styles = StyleSheet.create({
    itemContainerEven: {},
    itemContainerOdd: {
        backgroundColor: "#e6ffe6",
    },
    mainNameContainter: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
});
