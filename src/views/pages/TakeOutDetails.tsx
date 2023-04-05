import {
    BackHandler,
    FlatList,
    ListRenderItemInfo,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useGetDetailedTakeOut } from "../../query-hooks/UseTakeOuts";
import { TakenOutItem } from "../../interfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import TakeOutDeatilsItemTile from "../organisms/Tiles/TakeOutDeatilsItemTile";
import HeaderWithSearchBar from "../molecules/HeaderWithSearchBar";
import BottomControlButtons from "../organisms/BottomControlButtons";
import DefaultModal from "../molecules/DefaultModal";
import ReturnTakeOutModalContent from "../molecules/ReturnTakeOutModalContent";
import BottomCheckButton from "../atoms/BottomCheckButton";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    TakeOutStackParams,
    LoginDrawerParamList,
} from "../../navigation/ParamStacks";
import UnsavedListWarning from "../organisms/UnsavedListWarning";

export type TakeOutDetailsProps = CompositeScreenProps<
    NativeStackScreenProps<TakeOutStackParams, "TakeOutDetailsScreen">,
    DrawerScreenProps<LoginDrawerParamList>
>;

const TakeOutDetails = ({ navigation, route }: TakeOutDetailsProps) => {
    const [itemList, setItemList] = useState<TakenOutItem[]>([]);
    const [allItemsChecked, _setAllItemsChecked] = useState(false);
    const [acceptModalIsVisible, setAcceptModalIsVisible] = useState(false);
    const [warningModalIsVisible, setWarningModalIsVisible] = useState(false);
    const takeOut = route.params.takeOut;

    const getTakeOutItems = useGetDetailedTakeOut(takeOut.id);

    const allItemsCheckedRef = useRef(allItemsChecked);
    const setAllItemsChecked = (data: boolean) => {
        allItemsCheckedRef.current = data;
        _setAllItemsChecked(data);
    };

    useEffect(() => {
        if (getTakeOutItems.isSuccess) setItemList(getTakeOutItems.data);
    }, [getTakeOutItems.data]);

    useEffect(() => {
        setAllItemsChecked(
            !itemList.some((listItem) => listItem.is_checked === false)
        );
    }, [itemList]);

    useEffect(() => {
        // const kListener = Keyboard.addListener("keyboardDidHide", () => {
        // 	Keyboard.dismiss();
        // });
        const backAction = () => {
            if (allItemsCheckedRef.current) {
                setWarningModalIsVisible(true);
            } else {
                navigation.navigate("TakeOutSelectorScreen");
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => {
            // kListener.remove();
            backHandler.remove();
        };
    }, []);

    const toggleItemChecked = (itemId: number) => {
        setItemList((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, is_checked: !item.is_checked }
                    : item
            )
        );
    };

    const renderRow = useCallback(
        ({ item }: ListRenderItemInfo<TakenOutItem>) => {
            return (
                <TakeOutDeatilsItemTile
                    item={item}
                    toggleItemChecked={() => toggleItemChecked(item.id)}
                    editable={takeOut.end_date ? false : true}
                />
            );
        },
        []
    );

    const keyExtractor = (item: TakenOutItem) => item.id.toString();

    return (
        <View style={{ flex: 1 }}>
            {/* MODALS */}
            <DefaultModal
                visible={warningModalIsVisible}
                closeFn={() => setWarningModalIsVisible(false)}>
                <UnsavedListWarning
                    acceptModal={() =>
                        navigation.navigate("TakeOutSelectorScreen")
                    }
                    closeModal={() => setWarningModalIsVisible(false)}
                />
            </DefaultModal>

            <DefaultModal
                visible={acceptModalIsVisible}
                closeFn={() => setAcceptModalIsVisible(false)}>
                <ReturnTakeOutModalContent
                    closeFn={() => setAcceptModalIsVisible(false)}
                    takeOutId={takeOut.id}
                    acceptOnPress={navigation.goBack}
                />
            </DefaultModal>

            {/* PAGE CONTENT */}
            <HeaderWithSearchBar
                openDrawer={navigation.openDrawer}
                title={takeOut.take_out_name}
            />
            <Text style={styles.headerInfoText}>Kivett eszközök:</Text>
            <FlatList
                data={itemList}
                style={{ flex: 1 }}
                keyExtractor={keyExtractor}
                renderItem={renderRow}
                extraData={setItemList}
            />
            <BottomControlButtons>
                <BottomCheckButton
                    acceptButtonIsActive={allItemsChecked}
                    acceptButtonOnPress={() => setAcceptModalIsVisible(true)}
                />
            </BottomControlButtons>
        </View>
    );
};

export default TakeOutDetails;

const styles = StyleSheet.create({
    headerInfoText: {
        paddingHorizontal: 20,
        paddingBottom: 3,
        fontSize: 16,
    },
});
