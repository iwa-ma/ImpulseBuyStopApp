import {
  View, Text, StyleSheet, ActionSheetIOS, TouchableOpacity
} from 'react-native'
import { type Dispatch, useEffect, useState } from 'react'
import { auth } from 'config'
import { type priorityType } from 'types/priorityType'
import { getPriorityType } from 'utils/priorityUtils'

// スタイル定数
const FONT_SIZES = {
  normal: 16
} as const

const SPACING = {
  padding: {
    right: 16,
    bottom: 2
  },
  height: {
    picker: 60
  }
} as const

/** 親コンポーネントから受け取るprops型を定義 */
interface Props {
  /** 優先度選択値 */
  priorityCode: number
  /** 優先度更新制御 */
  setPriorityCode: Dispatch<React.SetStateAction<number>>
}

/**
 * 優先度選択ピッカー
 *
 * @param props
 * @returns {JSX.Element}
 */
const PriorityPicker = ({ priorityCode, setPriorityCode }: Props): JSX.Element => {
  const [priorityType, setPriorityType] = useState<priorityType[] | null>(null)

  useEffect(() => {
    if (!auth.currentUser) return
    getPriorityType((types: priorityType[]) => {
      setPriorityType(types)
    })
  }, [])

  /** 優先度選択値の変更 */
  const handlePickerChange = (itemIndex: number): void => {
    if (!priorityType || itemIndex < 0 || itemIndex >= priorityType.length) return
    setPriorityCode(priorityType[itemIndex].id)
  }

  /** アクションシートの表示 */
  const showActionSheet = (): void => {
    if (!priorityType?.length) return

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...priorityType.map(item => item.name), 'キャンセル'],
        cancelButtonIndex: priorityType.length
      },
      handlePickerChange
    )
  }

  if (!priorityType) return <></>

  const selectedPriority = priorityType.find(item => item.id === priorityCode)

  return (
    <View style={styles.container}>
      <View style={styles.pickerTitleWrap}>
        <Text style={styles.pickerTitleText}>【優先度選択】→</Text>
      </View>
      <View style={styles.pickerValueWrap}>
        <TouchableOpacity onPress={showActionSheet}>
          <Text>{selectedPriority?.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row' as const
  },
  pickerTitleWrap: {
    height: SPACING.height.picker,
    justifyContent: 'center' as const,
    alignItems: 'center' as const
  },
  pickerTitleText: {
    fontSize: FONT_SIZES.normal,
    paddingRight: SPACING.padding.right
  },
  pickerValueWrap: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingBottom: SPACING.padding.bottom
  }
})

export default PriorityPicker
