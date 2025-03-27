import {
  View, Text, TextInput,Alert,
  TouchableOpacity, StyleSheet
} from 'react-native'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { signInWithEmailAndPassword, getAuth, signInAnonymously } from 'firebase/auth'

import Button from '../../components/Button'
import { auth } from '../../config'
import AccountSettingModal from '../../components/AccountSettingModal'
import { MaterialIcons } from '@expo/vector-icons'

/**
 * ログインボタンクリック動作
 *
 * @param email
 * @param password
 */
const handleSubmitPress = (email: string, password: string): void => {
  // ログイン
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('log_in handleSubmitPress' + userCredential.user.uid)
      // ログイン処理に成功でリスト画面に書き換え、anonymousパラメーターに'false'を設定
      router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'false' }})
    })
    .catch((error) => {
        const { code, message }: { code: string, message: string } = error
        console.log(code, message)
        // ログイン失敗でアラートを画面に表示
        Alert.alert(message)
      }
    )
}

/** お試し体験モードリンククリック動作 */
const handleAnonymously = (): void => {
  const auth = getAuth()
  signInAnonymously(auth)
    .then((userCredential) => {
      console.log('log_in signInAnonymously' + userCredential.user.uid)
      // ログイン処理に成功でリスト画面に書き換え、anonymousパラメーターに'true'を設定
      router.replace({ pathname: '/ImpulseBuyStop/list', params: { anonymous: 'true' }})
    })
    .catch((error) => {
      const { code, message }: { code: string, message: string } = error
      console.log(code, message)
      // ログイン失敗でアラートを画面に表示
      Alert.alert(message)
    })
}

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
        <Text style={styles.title}>Log In</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {setEmail(text)}}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='Email Address'
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
            placeholder='Password'
            textContentType='password'
          />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={togglePasswordVisibility}
          >
            <MaterialIcons
              name={isSecure ? 'visibility' : 'visibility-off'}
              size={24}
            />
          </TouchableOpacity>
        </View>

        <Button label='Submit' onPress={() => {handleSubmitPress(email,password)}}/>
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
