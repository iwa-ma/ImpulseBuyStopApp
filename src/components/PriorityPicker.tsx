import {
  View, Text, StyleSheet
} from 'react-native'
import { collection, query, getDocs, where } from 'firebase/firestore'

import { Picker } from '@react-native-picker/picker'
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

const PriorityPicker = (props: Props): JSX.Element => {
  const [ priorityType, setPriorityType] = useState<priorityType[] | null>(null)
  const { priorityCode, setPriorityCode } = props

  async function getpriorityType():Promise<void> {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

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
  }

  useEffect(() => {
    // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
    if(!auth.currentUser) { return }

    (async () =>{
      await getpriorityType()
    })()
  }, [])

  return (
    <>
      { priorityType && (
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.pickerTitleWrap}>
            <Text style={styles.pickerTitleText}>【優先度選択】→</Text>
          </View>
          <Picker
              selectedValue={priorityCode}
              style={styles.picker}
              onValueChange={(itemValue:number) => setPriorityCode(itemValue)}
            >
              {priorityType.map((item) => (
                <Picker.Item key={item.id} label={item.name} value={item.id} />
              ))}
          </Picker>
        </View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  picker: {
    height: 60,
    width: '100%'
  },
  pickerTitleWrap:{
    height: 60,
    justifyContent: 'center', // 縦方向中央揃え
    alignItems: 'center' // 横方向中央揃え
  },
  pickerTitleText:{
    fontSize:16
  }
})
export default PriorityPicker
