import Button from '../Button'
import { auth } from '../../config'
import { type Dispatch } from 'react'
import { EditPassWordType} from '../../../types/ediPassWordType'
import { Alert } from 'react-native'
import { updatePassword, sendEmailVerification } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** パスワード入力値 */
  passWordInput: EditPassWordType,
  /** ダイアログ表示制御 */
  setDialogVisible:Dispatch<React.SetStateAction<boolean>>
}

/**
 * パスワード送信ボタン押下時の処理
 *
 * @param props パスワード送信ボタン押下時の処理
 * @returns {JSX.Element}
 */
const ButtonPasswordSending = (props: Props):JSX.Element => {
  const { passWordInput, setDialogVisible } = props

  //** ボタンの有効状態を返す */
  const buttonEnable = ():boolean => {
    //「新しいパスワード」、「確認のため再入力」いずれかが未入力の場合、偽を返す
    if (
        passWordInput.confirm.length === 0 ||
        passWordInput.new.length === 0
      ){
        return false
      }

    return true
  }

  // パスワード変更処理送信
  const handlePasswordSending = async (): Promise<void> => {
    // 未ログインの場合、以降の処理を実行しない
    if (!auth.currentUser){ return }

    // 新しいパスワード不一致
    if(passWordInput.confirm !== passWordInput.new){
      Alert.alert('新しいパスワードが一致しません')
      return
    }

    try {
      // パスワード変更処理
      await updatePassword(auth.currentUser, passWordInput.new)

      // メール確認メールを送信
      await sendEmailVerification(auth.currentUser)

      // 送信成功後、完了ダイアログを表示（サインアウトはAccountSettingModal.tsxで実行）
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const { code, message }: { code: string, message: string } = error

        // パスワードポリシーを満たしていない
        if(code === 'auth/weak-password' ){
          Alert.alert('パスワードは半角英数字記号6文字以上入力して下さい。')
          return
        }

        // 最後にログインから長期間経過
        if(code === 'auth/requires-recent-login' ){
          Alert.alert('長期間ログインされていない為、再ログイン後に操作を行って下さい。')
          return
        }

        // パスワード変更失敗でアラートを画面に表示
        Alert.alert(message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  }

  return (
    <Button
      label='送信'
      disabled={ !buttonEnable() ? true : false }
      buttonStyle={{
        marginTop: 0,
        marginBottom: 0,
        marginRight: 96,
        marginLeft: 0,
        opacity: !buttonEnable()  ? 0.7 : 1
      }}
      onPress={() => {
        handlePasswordSending()
      }}
    />
  )
}

export default ButtonPasswordSending
