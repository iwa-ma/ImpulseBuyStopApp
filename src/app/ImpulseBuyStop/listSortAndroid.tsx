import { View, StyleSheet, Text } from 'react-native'
import { useState } from 'react'
import { type SortType, OrderByDirection, SortValueType } from 'types/list'
import { Picker } from '@react-native-picker/picker'

// スタイル定数
const COLORS = {
  blue: '#0E75FC',
  white: '#ffffff'
}

const FONT_SIZES = {
  title: 16
}

const SPACING = {
  padding: {
    horizontal: 19
  },
  height: 40
}

/**
 * ソートオプションキー
 */
type SortOptionKey = `${SortType}:${OrderByDirection}`;

/**
 * ソートオプション
 */
const SORT_OPTIONS: Record<SortOptionKey, SortValueType> = {
  'updatedAt:desc': '最終更新日 新しい順',
  'updatedAt:asc': '最終更新日 古い順',
  'priority:asc': '優先度 高い順',
  'priority:desc': '優先度 低い順'
}

/** list.tsxから受け取るprops型を定義 */
interface Props {
  /** リストソートキー選択値 */
  itemsSortType: SortType
  /** リストソート選択値 */
  itemsSortOrder: OrderByDirection
  /** リストソートキー制御 */
  setItemsSortType: (type: SortType) => void
  /** リストソート順制御 */
  setItemsSortOrder: (order: OrderByDirection) => void
}

/**
 * リストソート
 *
 * @param props リストソートキー選択値
 * @returns {JSX.Element}
 */
const ListSortAndroid = (props: Props) => {
  const { itemsSortType, itemsSortOrder, setItemsSortType, setItemsSortOrder } = props
  // propsで受け取った値を初期値として設定
  const initialKey: SortOptionKey = `${itemsSortType}:${itemsSortOrder}`
  const [ sortKey, setSortKey ] = useState<SortOptionKey>(initialKey)

  const handlePickerChange = (selectedKey: SortOptionKey) => {
    // キーを分割してソートタイプとソート順を取得
    const [sortType, sortOrder] = selectedKey.split(":") as [SortType, OrderByDirection]
    // 選択されたキーをセット
    setSortKey(selectedKey)
    // ソートタイプとソート順をセット
    setItemsSortType(sortType)
    setItemsSortOrder(sortOrder)
  }

  return (
    <View style={styles.sortContainer}>
      <Text style={styles.sortTitleWrap}>並び替え → </Text>
      <Picker
        selectedValue={sortKey}
        onValueChange={handlePickerChange}
        style={styles.picker}
        mode="dropdown"
      >
        {Object.entries(SORT_OPTIONS).map(([key, value]) => (
          <Picker.Item
            key={key}
            label={value}
            value={key}
            style={styles.pickerItem}
          />
        ))}
      </Picker>
    </View>
  )
}

const styles = StyleSheet.create({
  sortContainer: {
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    paddingHorizontal: SPACING.padding.horizontal,
    alignItems: 'center',
    height: SPACING.height,
    zIndex: 1  // 追加：他の要素の上に表示されるようにする
  },
  sortTitleWrap: {
    color: COLORS.white,
    fontSize: FONT_SIZES.title,
    marginRight: 10  // 追加：テキストとPickerの間隔
  },
  picker: {
    flex: 1,
    color: COLORS.white,
    height: 60,  // 高さを50に変更してテキストが見えるようにする
    backgroundColor: 'transparent'  // 追加：背景を透明に
  },
  pickerItem: {
    color: '#000000',  // 追加：テキストの色を指定
    fontSize: 16  // 追加：フォントサイズを指定
  }
})

export default ListSortAndroid
