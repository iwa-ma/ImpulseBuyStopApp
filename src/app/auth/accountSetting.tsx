import { View, StyleSheet, Text, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { auth } from 'config'
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged } from 'firebase/auth'
import { modalModeType } from 'types/accountSettingModalMode'
import Button from 'components/Button'
import AccountSettingModal from 'components/AccountSettingModal'

// スタイル定数
const COLORS = {
  primary: '#87CEEB',
  secondary: '#ADD8E6',
  white: '#ffffff'
}

const FONT_SIZES = {
  title: 32,
  itemName: 24,
  content: 14
}

// 設定項目コンポーネント
const SettingItem = ({
  title,
  content,
  buttonLabel,
  onPress
}: {
  title: string;
  content: string;
  buttonLabel: string;
  onPress: () => void
}) => (
  <>
    <Text style={styles.itemNameFontType}>{title}</Text>
    <Text style={styles.itemContentsFontType}>{content}</Text>
    <View style={styles.buttonWrap}>
      <Button label={buttonLabel} onPress={onPress} />
    </View>
  </>
)

// 認証状態を管理するカスタムフック
const useAuthState = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!auth.currentUser) return

    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser !== null) {
          setEmail(currentUser.email)
        }
      })

      return () => unsubscribe()
    } catch (error: unknown) {
      const errorMessage = error instanceof FirebaseError
        ? `認証状態の取得に失敗しました: ${error.message}`
        : `予期せぬエラーが発生しました: ${error}`

      setError(errorMessage)
      Alert.alert('エラー', errorMessage)
    }
  }, [])

  return { email, error }
}

/**
 * アカウント設定画面
 */
const AccountSetting = (): JSX.Element => {
  const { email, error } = useAuthState()
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState<modalModeType>(null)

  const handleEditButton = (type: modalModeType): void => {
    setModalMode(type)
    setModalVisible(true)
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleFontType}>アカウント設定</Text>

      <SettingItem
        title="登録メールアドレス変更"
        content={`登録しているメールアドレスを変更します\n\nメールアドレス(現在設定): ${email}`}
        buttonLabel="登録メールアドレス変更"
        onPress={() => handleEditButton('eMail')}
      />

      <SettingItem
        title="セキュリティ"
        content="ログイン時のパスワードを変更します"
        buttonLabel="パスワード変更"
        onPress={() => handleEditButton('passWord')}
      />

      <SettingItem
        title="退会"
        content="退会すると登録データが消去されますのでご注意ください"
        buttonLabel="退会する"
        onPress={() => handleEditButton('cancelMembership')}
      />

      <AccountSettingModal
        modalVisible={modalVisible}
        modalMode={modalMode}
        setModalVisible={setModalVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: COLORS.white
  },
  titleFontType: {
    textAlign: 'center',
    fontSize: FONT_SIZES.title,
    fontWeight: 'normal',
    backgroundColor: COLORS.primary,
    fontFamily: 'Meiryo'
  },
  itemNameFontType: {
    textAlign: 'center',
    fontSize: FONT_SIZES.itemName,
    fontWeight: 'normal',
    backgroundColor: COLORS.secondary
  },
  itemContentsFontType: {
    flex: 1,
    paddingTop: 32,
    textAlign: 'center',
    fontSize: FONT_SIZES.content,
    fontWeight: 'normal',
    backgroundColor: COLORS.white
  },
  buttonWrap: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 20
  }
})

export default AccountSetting
