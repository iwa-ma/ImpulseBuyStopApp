import { TextInput, StyleSheet } from 'react-native'
import { type Dispatch } from 'react'


/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** メールアドレス入力値 */
  emailInput: string,
  /**  メールアドレス入力値変更用関数 */
  setInputEmail: Dispatch<React.SetStateAction<string>>
}

/**
 * メールアドレス入力
 *
 * @param props メールアドレス入力
 * @returns {JSX.Element}
 */
const TextInputEmail = (props: Props):JSX.Element => {
  // メールアドレス入力制御
  const { emailInput, setInputEmail } = props

  return (
    <TextInput
      style={styles.modalInput}
      value={emailInput}
      onChangeText={setInputEmail}
      autoCapitalize='none'
      keyboardType='email-address'
      placeholder='Email Address'
      textContentType='emailAddress'
    />
  )
}

const styles = StyleSheet.create({
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

export default TextInputEmail
