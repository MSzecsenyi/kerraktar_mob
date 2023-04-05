import { ListRenderItemInfo, StyleSheet, Text, View } from "react-native";
import { Item } from "../../interfaces";

interface TakeOutAcceptListItemProps {
    ListItemData: ListRenderItemInfo<Item>;
}

const TakeOutAcceptListItem = ({
    ListItemData,
}: TakeOutAcceptListItemProps) => {
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

            {item.unique_items.map((uniqueItem) => {
                if (item.selected_unique_items.includes(uniqueItem.unique_id)) {
                    return <Text>{`        -   ${uniqueItem.alt_name}`}</Text>;
                }
            })}
        </View>
    );
};

export default TakeOutAcceptListItem;

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
