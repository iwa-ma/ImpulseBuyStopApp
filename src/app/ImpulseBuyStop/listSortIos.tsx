import { View, StyleSheet, Text, ActionSheetIOS, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { type SortType, OrderByDirection, SortValueType } from 'types/list'

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

// ソートキーとソート順に対応するラベル
const SORT_LABELS = ['キャンセル', ...Object.values(SORT_OPTIONS)]

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
const ListSortIos = (props: Props) => {
  const { itemsSortType, itemsSortOrder, setItemsSortType, setItemsSortOrder } = props
  // propsで受け取った値を初期値として設定
  const initialKey: SortOptionKey = `${itemsSortType}:${itemsSortOrder}`
  const [ sortKey, setSortKey ] = useState<SortOptionKey>(initialKey)

  const handlePickerChange = (itemIndex: number) => {
    // キャンセルボタンを選択した場合は何もしない
    if (itemIndex === 0) return
    // 選択されたキーを取得
    const selectedKey = Object.keys(SORT_OPTIONS)[itemIndex - 1] as SortOptionKey
    // キーを分割してソートタイプとソート順を取得
    const [sortType, sortOrder] = selectedKey.split(":") as [SortType, OrderByDirection]
    // 選択されたキーをセット
    setSortKey(selectedKey)
    // ソートタイプとソート順をセット
    setItemsSortType(sortType)
    setItemsSortOrder(sortOrder)
  }

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: SORT_LABELS,
        cancelButtonIndex: 0
      },
      handlePickerChange
    )
  }

  return (
    <View style={styles.sortContainer}>
      <Text style={styles.sortTitleWrap}>並び替え → </Text>
      <TouchableOpacity onPress={showActionSheet}>
        <Text style={styles.sortTitleWrap}>{SORT_OPTIONS[sortKey]}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  sortContainer: {
    backgroundColor: COLORS.blue,
    flexDirection: 'row',
    paddingHorizontal: SPACING.padding.horizontal,
    alignItems: 'center',
    height: SPACING.height
  },
  sortTitleWrap: {
    color: COLORS.white,
    fontSize: FONT_SIZES.title
  }
})

export default ListSortIos
