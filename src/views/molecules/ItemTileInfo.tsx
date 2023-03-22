import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Item } from '../../interfaces'

interface ItemTileInfoProps {
    item: Item
}

const ItemTileInfo = ({item}: ItemTileInfoProps) => {
  return (
    <View style={styles.info_part}>
				<View style={styles.info_row}>
					<Text style={styles.card_title}> {item.item_name} </Text>
					<Text> Store: {item.store} </Text>
					<Text> District: {item.district} </Text>
				</View>
				<View style={styles.info_row}>
					<Text> In store: {item.in_store_amount} </Text>
					<Text> Id: {item.id} </Text>
					<Text> U.pcs: {item.unique_items.length} </Text>
				</View>
			</View>
  )
}

export default ItemTileInfo

const styles = StyleSheet.create({
	info_part: {
		flex: 0.7,
		justifyContent: "space-between",
	},
	info_row: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	card_title: {
		fontSize: 16,
		fontWeight: "bold",
	},})