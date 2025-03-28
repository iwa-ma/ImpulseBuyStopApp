import {
  View, Text, StyleSheet, ActionSheetIOS, TouchableOpacity, Alert
} from 'react-native'
import { collection, query, getDocs, where } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'

import { type priorityType} from '../../types/priorityType'
import { useEffect,useState } from 'react'
import { db, auth } from '../config'
import { type Dispatch} from 'react'

/** 親コンポーネントから受け取るprops型を定義 */
interface Props {
  /** 優先度選択値 */
  priorityCode:number
  /** 優先度更新制御 */
  setPriorityCode:Dispatch<React.SetStateAction<number>>
}

/**
 * 優先度選択ピッカー
 *
 * @param props
 * @returns {JSX.Element}
 */
const PriorityPicker = (props: Props): JSX.Element => {
  const [ priorityType, setPriorityType] = useState<priorityType[] | null>(null)
  const { priorityCode, setPriorityCode } = props

  async function getpriorityType():Promise<void> {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

    try {
      // コレクションを取得して、更新日時の昇順でソート
      const ref = collection(db, 'priorityType')
      const q = query(ref, where("disabled", "==", false))
      const tempItems: priorityType[] = []
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach((doc)=> {
        const { name, disabled,id} = doc.data()
        // 項目が有効な場合、リスト項目として追加
        if(!disabled){
          tempItems.push({
            id: id,
            name
          })
        }
      })

      setPriorityType(tempItems)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { message }: { message: string } = error
        Alert.alert('優先度の取得に失敗しました\n'+message)
      } else {
        Alert.alert('優先度の取得に失敗しました\n'+error)
      }
    }
  }

  useEffect(() => {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

    (async () =>{
      await getpriorityType()
    })()
  }, [])

  // 優先度選択ピッカーの値を変更する
  const handlePickerChange = (itemIndex: number) => {
    if (priorityType && itemIndex >= 0 && itemIndex < priorityType.length) {
      setPriorityCode(priorityType[itemIndex].id)
    }
  }

  // 優先度選択ピッカーを表示する
  const showActionSheet = () => {
    if (!priorityType?.length) return

    // 取得した優先度リストを表示する、キャンセルボタンを追加する
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...priorityType.map(item => item.name), 'キャンセル'],
        cancelButtonIndex: priorityType.length
      },
      handlePickerChange
    )
  }

  return (
    <>
      { priorityType && (
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.pickerTitleWrap}>
            <Text style={styles.pickerTitleText}>【優先度選択】→</Text>
          </View>

          <View style={styles.pickerValueWrap}>
            <TouchableOpacity onPress={showActionSheet}>
              <Text>{priorityType.find((item) => item.id === priorityCode)?.name}</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  pickerTitleWrap:{
    height: 60,
    justifyContent: 'center', // 縦方向中央揃え
    alignItems: 'center' // 横方向中央揃え
  },
  pickerTitleText:{
    fontSize:16,
    paddingRight:16
  },
  pickerValueWrap:{
    justifyContent: 'center', // 縦方向中央揃え
    alignItems: 'center', // 横方向中央揃え
    paddingBottom: 2
  }
})
export default PriorityPicker
