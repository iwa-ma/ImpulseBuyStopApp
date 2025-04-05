import { type Dispatch } from 'react'
import { Alert } from 'react-native'
import { auth } from 'config'
import { EditPassWordType } from 'types/editPassWordType'
import { updatePassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import Button from 'components/Button'

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** パスワード入力値 */
  passWordInput: EditPassWordType,
  /** ダイアログ表示制御 */
  setDialogVisible: Dispatch<React.SetStateAction<boolean>>
}

/**
 * パスワード送信ボタン押下時の処理
 *
 * @param props パスワード送信ボタン押下時の処理
 * @returns {JSX.Element}
 */
const ButtonPasswordSending = (props: Props): JSX.Element => {
  const { passWordInput, setDialogVisible } = props

  //** ボタンの有効状態を返す */
  const isButtonEnabled = (): boolean => {
        //「新しいパスワード」、「確認のため再入力」いずれかが未入力の場合、偽を返す
    return passWordInput.confirm.length > 0 && passWordInput.new.length > 0
  }

  // パスワード変更処理
  const handlePasswordSending = async (): Promise<void> => {
    if (!auth.currentUser) return

    if (passWordInput.confirm !== passWordInput.new) {
      Alert.alert('新しいパスワードが一致しません')
      return
    }

    try {
      await updatePassword(auth.currentUser, passWordInput.new)
      setDialogVisible(true)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        // パスワードポリシーを満たしていない
        if (error.code === 'auth/weak-password') {
          Alert.alert('パスワードは半角英数字記号6文字以上入力して下さい。')
          return
        }
        // 最後にログインから長期間経過
        if (error.code === 'auth/requires-recent-login') {
          Alert.alert('長期間ログインされていない為、再ログイン後に操作を行って下さい。')
          return
        }
        Alert.alert(error.message)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n' + error)
      }
    }
  }

  const isDisabled = !isButtonEnabled()

  return (
    <Button
      label="送信"
      disabled={isDisabled}
      buttonStyle={{
        marginTop: 0,
        marginBottom: 0,
        marginRight: 96,
        marginLeft: 0,
        opacity: !isButtonEnabled() ? 0.7 : 1
      }}
      onPress={handlePasswordSending}
    />
  )
}

export default ButtonPasswordSending
