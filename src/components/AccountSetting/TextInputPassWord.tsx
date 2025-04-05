import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { type Dispatch, useState } from 'react'
import { EditPassWordType } from 'types/editPassWordType'
import CustomIcon from 'components/icon'

// スタイル定数
const STYLES = {
  itemName: {
    fontSize: 20,
    paddingBottom: 8
  },
  modalInput: {
    height: 48,
    fontSize: 16,
    flex: 1
  },
  inputContainer: {
    //StyleSheet.createで警告が出るため、as constを追加
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
}

/** accountSettingModal.tsxから受け取るprops型を定義 */
interface Props {
  /** パスワード入力値 */
  passWordInput: EditPassWordType,
  /** パスワード入力値変更用関数 */
  setPassWordInput: Dispatch<React.SetStateAction<EditPassWordType>>
}

const PasswordInputField = ({
  value,
  onChangeText,
  placeholder,
  isSecure,
  toggleVisibility
}: {
  /** パスワード入力値 */
  value: string
  /** パスワード入力値変更用関数 */
  onChangeText: (text: string) => void
  /** パスワード入力フィールドプレースホルダー */
  placeholder: string
  /** パスワード入力フィールド表示/非表示状態 */
  isSecure: boolean
  /** パスワード入力フィールド表示/非表示状態変更用関数 */
  toggleVisibility: () => void
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.modalInput}
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      keyboardType="default"
      placeholder={placeholder}
      textContentType="password"
      secureTextEntry={isSecure}
    />
    <TouchableOpacity
      style={styles.visibilityToggle}
      onPress={toggleVisibility}
    >
      <CustomIcon
        name={isSecure ? 'eye' : 'eye-blocked'}
        size={24}
        color="#000000"
      />
    </TouchableOpacity>
  </View>
)

/**
 * パスワード入力
 *
 * @param props パスワード入力
 * @returns {JSX.Element}
 */
const TextInputPassWord = (props: Props): JSX.Element => {
  const { passWordInput, setPassWordInput } = props
  const [isSecure, setIsSecure] = useState(true)
  const [isSecureConfirm, setIsSecureConfirm] = useState(true)

  const handleNewPasswordChange = (text: string) => {
    setPassWordInput({ ...passWordInput, new: text })
  }

  const handleConfirmPasswordChange = (text: string) => {
    setPassWordInput({ ...passWordInput, confirm: text })
  }

  return (
    <>
      <Text style={styles.ItemName}>新しいパスワード</Text>
      <PasswordInputField
        value={passWordInput.new}
        onChangeText={handleNewPasswordChange}
        placeholder="新しいパスワードを入力して下さい"
        isSecure={isSecure}
        toggleVisibility={() => setIsSecure(!isSecure)}
      />

      <Text style={styles.ItemName}>新しいパスワード(確認用)</Text>
      <PasswordInputField
        value={passWordInput.confirm}
        onChangeText={handleConfirmPasswordChange}
        placeholder="確認用に新しいパスワードを入力して下さい"
        isSecure={isSecureConfirm}
        toggleVisibility={() => setIsSecureConfirm(!isSecureConfirm)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  ItemName: STYLES.itemName,
  modalInput: STYLES.modalInput,
  inputContainer: STYLES.inputContainer,
  visibilityToggle: STYLES.visibilityToggle
})

export default TextInputPassWord
