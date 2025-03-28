import { View,Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { type Dispatch} from 'react'
import { EditPassWordType} from '../../../types/ediPassWordType'
import { useState } from 'react'
import CustomIcon from '../../components/icon'

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** パスワード入力値 */
  passWordInput: EditPassWordType,
  /** パスワード入力値変更用関数 */
  setPassWordInput: Dispatch<React.SetStateAction<EditPassWordType>>
}

const TextInputPassWord = (props: Props):JSX.Element => {
  // パスワード入力制御
  const { passWordInput, setPassWordInput } = props

  const [isSecure, setIsSecure] = useState(true) // secureTextEntryの状態を管理
  const [isSecureConfirm, setIsSecureConfirm] = useState(true)// secureTextEntryの状態を管理

  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure)// 表示/非表示を切り替える
  }

  const togglePasswordVisibilityConfirm = () => {
    setIsSecureConfirm(!isSecureConfirm) // 表示/非表示を切り替える
  }

  return (
    <>
      <Text style={ styles.ItemName }>新しいパスワード</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={ styles.modalInput }
          value={ passWordInput.new }
          onChangeText={(text) => { setPassWordInput({ ...passWordInput, new: text }) }}
          autoCapitalize='none'
          keyboardType='default'
          placeholder='新しいパスワードを入力して下さい'
          textContentType='password'
          secureTextEntry={isSecure}
        />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={togglePasswordVisibility}
          >
            <CustomIcon
              name={isSecure ? 'eye' : 'eye-blocked'}
              size={24}
              color='#000000'
            />
          </TouchableOpacity>
      </View>

      <Text style={ styles.ItemName }>新しいパスワード(確認用)</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={ styles.modalInput }
          value={ passWordInput.confirm }
          onChangeText={(text) => { setPassWordInput({ ...passWordInput, confirm: text}) }}
          autoCapitalize='none'
          keyboardType='default'
          placeholder='確認用に新しいパスワードを入力して下さい'
          textContentType='password'
          secureTextEntry={isSecureConfirm}
        />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={togglePasswordVisibilityConfirm}
          >
            <CustomIcon
              name={isSecureConfirm ? 'eye' : 'eye-blocked'}
              size={24}
              color='#000000'
            />
          </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  ItemName:{
    fontSize:20,
    paddingBottom:8
  },
  modalInput: {
    height: 48,
    fontSize: 16,
    flex: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
    paddingLeft: 16,
    paddingRight: 8
  },
  visibilityToggle: {
    padding: 8
  }
})

export default TextInputPassWord
