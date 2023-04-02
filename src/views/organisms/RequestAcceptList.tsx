import { FlatList, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { modalStyles } from '../../styles';
import LoadingSpinner from '../atoms/LoadingSpinner';
import { RequestItem } from '../../interfaces';
import { useState } from 'react';
import RequestAcceptListItem from '../atoms/RequestAcceptListItem';
import { AxiosResponse } from 'axios';
import { UseMutationResult } from 'react-query';
interface RequestAcceptListProps {
    setModalIsVisible: (value: React.SetStateAction<boolean>) => void
    items: RequestItem[]
    listName: string
    onChangeText: (text: string) => void
	postRequest: UseMutationResult<AxiosResponse<any, any>, unknown, void, unknown>
}

const RequestAcceptList = ({setModalIsVisible, items, listName, onChangeText, postRequest}: RequestAcceptListProps) => {
	const [listSendLoading, setListSentLoading] = useState(false);
    
  return (
    <>
							<TouchableOpacity onPress={() => setModalIsVisible(false)}>
								<Text style={modalStyles.mainText}>Kiválasztott eszközök:</Text>
							</TouchableOpacity>
							<FlatList
								data={items
									.filter((item) => item.is_selected)
									.sort((a, b) => a.item_name.localeCompare(b.item_name))}
								keyExtractor={(item) => item.id.toString()}
								renderItem={(item) => (
									<RequestAcceptListItem ListItemData={item} />
								)}
							/>
							<TextInput
								style={modalStyles.textInput}
								defaultValue={listName}
								onChangeText={onChangeText}
								placeholder="Hol használod az eszközöket?"
							/>
							<View style={modalStyles.buttonContainer}>
								{listSendLoading ? (
									<LoadingSpinner />
								) : (
									<>
										<TouchableHighlight
											style={modalStyles.buttonReject}
											onPress={() => setModalIsVisible(false)}
										>
											<Text style={modalStyles.buttonRejectText}>Mégse</Text>
										</TouchableHighlight>
										<TouchableHighlight
											style={
												listName.length != 0
													? modalStyles.buttonAccept
													: modalStyles.buttonDisabled
											}
											onPress={() => {
												console.log("pressed")
												postRequest.mutate();
												setListSentLoading(true);
											}}
										>
											<Text style={modalStyles.buttonAcceptText}>Kivétel</Text>
										</TouchableHighlight>
									</>
								)}
							</View>
						</>
  )
}

export default RequestAcceptList

const styles = StyleSheet.create({})