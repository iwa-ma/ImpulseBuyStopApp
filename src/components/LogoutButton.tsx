import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native'
import { signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { FirebaseError } from 'firebase/app'

import { auth } from '../config'

const handlePress = async (): Promise<void> => {
  try {
    await signOut(auth)
    // ログイン画面に書き換え
    router.replace('/auth/log_in')
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { message }: { message: string } = error
      Alert.alert('ログアウトに失敗しました\n'+message)
    } else {
      Alert.alert('ログアウトに失敗しました\n'+error)
    }
  }
}

const LogOutButton = (): JSX.Element => {
    return (
        <TouchableOpacity onPress={handlePress}>
            <Text style={styles.text}>ログアウト</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    text: {fontSize: 12,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.7)'
    }
})

export default LogOutButton
