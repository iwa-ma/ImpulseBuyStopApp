import {
  View, Text, StyleSheet, ActionSheetIOS, TouchableOpacity, Alert
} from 'react-native'
import { type Dispatch, useEffect, useState } from 'react'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { db, auth } from 'config'
import { type priorityType } from 'types/priorityType'

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

  /** 優先度タイプの取得 */
  const getPriorityType = async (): Promise<void> => {
    if (!auth.currentUser) return

    try {
      const ref = collection(db, 'priorityType')
      const q = query(ref, where('disabled', '==', false))
      const querySnapshot = await getDocs(q)

      const tempItems = querySnapshot.docs
        .map(doc => {
          const { name, disabled, id } = doc.data()
          return !disabled ? { id, name } : null
        })
        .filter((item): item is priorityType => item !== null)

      setPriorityType(tempItems)
    } catch (error) {
      const message = error instanceof FirebaseError
        ? error.message
        : String(error)
      Alert.alert('優先度の取得に失敗しました', message)
    }
  }

  useEffect(() => {
    if (!auth.currentUser) return
    getPriorityType()
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
