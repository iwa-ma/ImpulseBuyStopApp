import { Alert } from 'react-native'
import Button from '../Button'
import { auth, db } from '../../config'
import { doc, setDoc, Timestamp, deleteDoc, getDoc } from 'firebase/firestore'
import { deleteUser }from 'firebase/auth'
import { type Dispatch} from 'react'
import { useUnsubscribe } from '../../app/UnsubscribeContext'
import { DeleteUsers } from '../../../types/deleteUsers'
import { FirebaseError } from "firebase/app"

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** ダイアログ表示制御 */
  setDialogVisible:Dispatch<React.SetStateAction<boolean>>
}

const ButtonCancelMembershipSending = (props: Props):JSX.Element => {
  const { setDialogVisible } = props
  // リスト(list.tsx)のリスト取得処理のunsubscribe
  const { unsubscribe } = useUnsubscribe()
  /** 削除ユーザー履歴の登録 */
  async function regCancelMember():Promise<void> {
    // 未ログインまたはメールアドレス未設定の場合、以降の処理を実行しない
    if (!auth.currentUser || !auth.currentUser.email){ return }

    // ログイン情報を基に登録データを生成
    const data: DeleteUsers = {
      UID: auth.currentUser.uid,
      id: auth.currentUser.email,
      createdAt: Timestamp.fromDate(new Date())
    }

    try {
      // apiを使用して登録処理を行う
      const ref = doc(db, `deleteUsers/${auth.currentUser.uid}`)
      await setDoc(ref, data)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { message }: { message: string } = error
        Alert.alert(message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  }

  /**ユーザー削除処理 */
  async function HandledeleteUser():Promise<void> {
    // 未ログインの場合、以降の処理を実行しない
    if (!auth.currentUser){ return }

    try {
      await deleteUser(auth.currentUser)
      // 送信成功後、完了ダイアログを表示
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {

        if (!auth.currentUser){ return }

        try {
          // 削除処理に失敗した場合、ログイン中ユーザーのuidを指定して削除ユーザー履歴を削除
          await deleteDoc(doc(db, `deleteUsers/` , auth.currentUser.uid))
        } catch (deleteError) {
          Alert.alert('予期せぬエラーが発生しました\n'+deleteError)
        }

        const { message }: { message: string } = error

        // 最後にログインから長期間経過
        if(message === 'auth/requires-recent-login' ){
          Alert.alert('長期間ログインされていない為、再ログイン後に操作を行って下さい。')
          return
        }
        Alert.alert(message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  }

  // 退会処理送信
  async function handleCancelMemberSending() {
    // 未ログインの場合、以降の処理を実行しない
    if (!auth.currentUser){ return }

    try {
      // 削除ユーザー履歴登録処理
      await regCancelMember()

      // 削除ユーザー履歴登録結果確認
      const docRef = doc(db, `deleteUsers/`, auth.currentUser.uid)
      const result = await getDoc(docRef)

      // 削除ユーザー履歴の登録実行※削除ユーザー履歴が登録されていない場合は実行しない
      // 削除ユーザー履歴登録失敗のエラーはregCancelMember()関数が表示
      if(result.exists()){
        if (unsubscribe) unsubscribe()
        await HandledeleteUser()
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { message }: { message: string } = error
        Alert.alert(message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  }

  return (
    <Button
      label='はい'
      disabled={ false }
      buttonStyle={{
        marginTop: 0,
        marginBottom: 0,
        marginRight: 96,
        marginLeft: 0,
        opacity: 1
      }}
      onPress={() => {
      handleCancelMemberSending()
      }}
    />
  )
}

export default ButtonCancelMembershipSending
