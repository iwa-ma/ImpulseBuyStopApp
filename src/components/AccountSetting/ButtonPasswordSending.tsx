import Button from '../Button'
import { auth } from '../../config'
import { type Dispatch} from 'react'
import { passWordType } from './TextInputPassWord'
import { Alert } from 'react-native'
import { updatePassword }from 'firebase/auth'
interface Props {
  /** メールアドレス入力値 */
  passWordInput: passWordType,
  /** ダイアログ表示制御 */
  setDialogVisible:Dispatch<React.SetStateAction<boolean>>
}

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

  // パスワード変更送信処理
  const handlePasswordSending = ():void => {
    // 未ログインの場合、以降の処理を実行しない
    if (!auth.currentUser){ return }

      // 新しいパスワード不一致
      if(passWordInput.confirm !== passWordInput.new){
        Alert.alert('新しいパスワードが一致しません')
        return
      }

      updatePassword(auth.currentUser, passWordInput.new).then(() => {
        // 送信成功後、完了ダ[イアログを表示
        setDialogVisible(true)
      }).catch((error) => {
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
      })
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
