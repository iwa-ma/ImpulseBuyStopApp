import Button from '../Button'
import { auth } from '../../config'
import { type Dispatch} from 'react'
import { passWordType } from './TextInputPassWord'

interface Props {
  /** メールアドレス入力値 */
  passWordInput: passWordType,
  /** ダイアログ表示制御 */
  setDialogVisible:Dispatch<React.SetStateAction<boolean>>
}

const ButtonPasswordSending = (props: Props):JSX.Element => {
  const { passWordInput } = props

  //** ボタンの有効状態を返す */
  const buttonEnable = ():boolean => {
    // 現在のパスワード」、「新しいパスワード」、「確認のため再入力」いずれかが未入力の場合、偽を返す
    if (
        passWordInput.actve.length === 0 ||
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
