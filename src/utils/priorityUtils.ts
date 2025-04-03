import { type Dispatch} from 'react'
import { Alert } from 'react-native'
import { db, auth } from 'config'
import { FirebaseError } from 'firebase/app'
import { collection, query ,getDocs, where } from 'firebase/firestore'
import { type priorityType} from 'types/priorityType'

interface Props {
  /** 優先度名更新 */
  setPriorityType: Dispatch<React.SetStateAction<priorityType[]>>
}

/** 優先度名を取得 */
export async function getpriorityType(props:Props):Promise<void> {
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

    props.setPriorityType(tempItems)
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { message }: { message: string } = error
      Alert.alert('優先度の取得に失敗しました\n'+message)
    } else {
      Alert.alert('優先度の取得に失敗しました\n'+error)
    }
  }
}

/** code → 優先度名の変換を行う */
export function getpriorityName(priorityType:priorityType[],id:number):string {
  // 優先度名が取得されていない場合は処理を実行ぜずに終了する
  if(!priorityType.length){return ''}
  const result = priorityType.find((type) => type.id == id)

  // codeに対応する優先度名が取得できた場合は結果を返す
  if(result){return result.name}

  // codeに対応する優先度名が取得できない場合は、空文字を返す
  return ''
}
