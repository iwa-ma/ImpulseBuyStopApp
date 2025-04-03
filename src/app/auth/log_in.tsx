import {
  View, Text, TextInput,Alert,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { auth } from 'config'
import { signInWithEmailAndPassword, getAuth, signInAnonymously } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import CustomIcon from 'components/icon'
import Button from 'components/Button'
import AccountSettingModal from 'components/AccountSettingModal'

/**
 * ログインボタンクリック動作
 *
 * @param email
 * @param password
 */
const handleSubmitPress = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user.emailVerified) {
      Alert.alert('メールアドレスが確認されていません。有効期限が切れている場合は、再登録して下さい。')
      return
    }

    // ログイン成功時はリスト画面に遷移
    router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'false' }})
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code } = error

      switch (code) {
        case 'auth/user-not-found':
          Alert.alert('メールアドレスまたはパスワードが違います')
          break
        case 'auth/too-many-requests':
          Alert.alert('ログイン試行回数が多すぎます。しばらく時間をおいて再度お試しください。')
          break
        case 'auth/network-request-failed':
          Alert.alert('ネットワークエラーが発生しました。インターネット接続を確認してください。')
          break
        default:
          Alert.alert('ログインに失敗しました')
      }
    } else {
      Alert.alert('予期せぬエラーが発生しました')
    }
  }
}

/** お試し体験モードリンククリック動作 */
const handleAnonymously = async (): Promise<void> => {
  const auth = getAuth()
  try {
    const userCredential = await signInAnonymously(auth)
    if(userCredential.user.uid){
      // ログイン処理に成功でリスト画面に書き換え、anonymousパラメーターに'true'を設定
      router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'true' }})
    }else{
      Alert.alert('ログインに失敗しました')
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { code, message } = error
      if(code === 'auth/operation-not-allowed'){
        Alert.alert('ログインに失敗しました')
      }else{
        // ログイン失敗でアラートを画面に表示
        Alert.alert(message)
      }
    } else {
      Alert.alert('予期せぬエラーが発生しました\n'+error)
    }
  }
}

/**
 * ログイン画面
 *
 * @returns {JSX.Element}
 */
const LogIn = (): JSX.Element => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ modalVisible, setModalVisible ] = useState(false)

  const [isSecure, setIsSecure] = useState(true)// secureTextEntryの状態を管理

  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure) // 表示/非表示を切り替える
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>ログイン</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {setEmail(text)}}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='メールアドレスを入力してください'
            textContentType='emailAddress'
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {setPassword(text)}}
            autoCapitalize='none'
            secureTextEntry={isSecure}
            placeholder='パスワードを入力してください'
            textContentType='password'
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

        <Button label='ログイン'
          disabled={email === '' || password === ''}
          buttonStyle={{ marginBottom: 24, opacity: email === '' || password === '' ? 0.5 : 1 }}
          onPress={() => {handleSubmitPress(email,password)}}
        />
        <View>
          <Text style={styles.footerText}>未登録の場合はこちら</Text>

          <Text>
            <Link href='/auth/sign_up' asChild replace>
              <TouchableOpacity>
                  <Text style={styles.footerLink}>1.ユーザー登録する！</Text>
              </TouchableOpacity>
            </Link>
          </Text>

          <Text>
            <TouchableOpacity onPress={() => { handleAnonymously() }}>
              <Text style={styles.footerLink}>
                2.お試し体験モードで操作する！
              </Text>
            </TouchableOpacity>
          </Text>

          <Text style={styles.footerText}>パスワードを忘れてしまった方</Text>
          <Text>
            <TouchableOpacity onPress={() => { setModalVisible(true) }}>
              <Text style={styles.footerLink}>
                3.パスワード再設定
              </Text>
            </TouchableOpacity>
          </Text>

          {/* パスワード再設定用モーダル */}
          <AccountSettingModal
            modalVisible={ modalVisible }
            modalMode='passWordReset'
            setModalVisible={ setModalVisible }
          />
        </View>
      </View>
    </View>
  )
}

const styles =StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8'
  },
  inner: {
    paddingVertical: 24,
    paddingHorizontal: 27
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
    marginBottom: 24
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    marginBottom: 24
  },
  input: {
    flex: 1,
    height: 48,
    padding: 8,
    fontSize: 16

  },
  visibilityToggle: {
    padding: 8
  },
  footerText:{
    fontSize: 14,
    lineHeight: 24,
    marginRight: 8,
    color: '#000000'
  },
  footerLink:{
    fontSize: 14,
    lineHeight: 24,
    color: '#467FD3',
    paddingBottom: 32
  }
})

export default LogIn
