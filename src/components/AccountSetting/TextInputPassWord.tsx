import { Text, TextInput, StyleSheet } from 'react-native'
import { type Dispatch} from 'react'

/** パスワード入力値の型定義 */
type passWordType = {
  actve: string,
  new: string,
  confirm: string
}

interface Props {
  /** メールアドレス入力値 */
  passWordInput: passWordType,
  /**  メールアドレス入力値変更用関数 */
  setPassWordInput : Dispatch<React.SetStateAction<passWordType>>
}

const TextInputPassWord = (props: Props):JSX.Element => {
  // メールアドレス入力制御
  const { passWordInput, setPassWordInput } = props

  return (
    <>
      <Text style={ styles.ItemName }>現在のパスワード</Text>
      <TextInput
        style={ styles.modalInput }
        value={ passWordInput.actve }
        onChangeText={(text) => { setPassWordInput({ ...passWordInput, actve: text }) }}
        autoCapitalize='none'
        keyboardType='default'
        placeholder='現在のパスワードを入力して下さい'
        textContentType='password'
      />

      <Text style={ styles.ItemName }>新しいパスワード</Text>
      <TextInput
        style={ styles.modalInput }
        value={ passWordInput.new }
        onChangeText={(text) => { setPassWordInput({ ...passWordInput, new: text }) }}
        autoCapitalize='none'
        keyboardType='default'
        placeholder='新しいパスワードを入力して下さい'
        textContentType='password'
      />

      <Text style={ styles.ItemName }>新しいパスワード(確認用)</Text>
      <TextInput
        style={ styles.modalInput }
        value={ passWordInput.confirm }
        onChangeText={(text) => { setPassWordInput({ ...passWordInput, confirm: text}) }}
        autoCapitalize='none'
        keyboardType='default'
        placeholder='確認用に新しいパスワードを入力して下さい'
        textContentType='password'
      />
    </>
  )
}

const styles = StyleSheet.create({
  ItemName:{
    fontSize:20,
    paddingBottom:8
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    height: 48,
    padding: 8,
    fontSize: 16,
    marginBottom: 24
  }
})

export default TextInputPassWord
