import { View, StyleSheet, Text } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { type Dispatch, useState} from 'react'
import { type SortType,OrderByDirection,pickerChangeType } from '../../app/../../types/list'

interface Props {
  /** リストソートキー選択値 */
  itemsSortType:SortType
  /** リストソート選択値 */
  itemsSortOrder:OrderByDirection
  /** リストソートキー制御 */
  setItemsSortType:Dispatch<React.SetStateAction<SortType>>
  /** リストソート順制御 */
  setItemsSortOrder:Dispatch<React.SetStateAction<OrderByDirection>>
}

const ListSort = (props: Props) => {
  const { itemsSortType,itemsSortOrder,setItemsSortType,setItemsSortOrder } = props
  const initPickerChangeType:pickerChangeType = (itemsSortType + ':'+ itemsSortOrder) as pickerChangeType

  const [ pickerValue, setPickerValue ]  = useState<pickerChangeType>(initPickerChangeType)
  const handlePickerChange = (itemValue:pickerChangeType) => {
    const result:[SortType,OrderByDirection] = itemValue.split(":") as [SortType,OrderByDirection]
    setPickerValue(itemValue)
    setItemsSortType(result[0])
    setItemsSortOrder(result[1])
  }
  return (
  <View style={styles.sortContainer}>
    <Text style={styles.sortTitleWrap}>並び替え  →</Text>
    <Picker
      selectedValue={pickerValue}
      style={styles.picker}
      onValueChange={handlePickerChange}
    >
      <Picker.Item label="最終更新日 新しい順" value='updatedAt:desc' />
      <Picker.Item label="最終更新日 古い順" value='updatedAt:asc' />
      <Picker.Item label="優先度 高い順" value='priority:asc' />
      <Picker.Item label="優先度 低い順" value='priority:desc' />
    </Picker>
  </View>
  )
}

const styles = StyleSheet.create({
  sortContainer: {
    backgroundColor: '#0E75FC',
    flexDirection: 'row',
    paddingHorizontal: 19, // 横方向のpadding
    alignItems: 'center',
    height: 40
  },
  sortTitleWrap:{
    color: '#ffffff'
  },
  pickerTitleText:{
    fontSize:16
  },
  picker: {
    width: '100%',
    color: '#ffffff'
  }
})

export default ListSort
