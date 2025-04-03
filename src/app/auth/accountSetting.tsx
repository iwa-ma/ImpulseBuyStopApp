import { View, StyleSheet, Text, Alert } from 'react-native'
import { useState, useEffect} from 'react'
import { auth } from 'config'
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged } from 'firebase/auth'
import { modalModeType } from 'types/accountSettingModalMode'
import Button from 'components/Button'
import AccountSettingModal from 'components/AccountSettingModal'

/**
 * アカウント設定画面
 *
 * @returns {JSX.Element}
 */
const accountSetting = ():JSX.Element => {
  // メールアドレス
  const [ email, setEmail ] = useState<string | null>(null)
  // モーダル表示
  const [ modalVisible, setModalVisible ] = useState(false)
  // モーダルモード
  const [ modalMode, setModalMode ] = useState<modalModeType>(null)

  const emailContent:string = `登録しているメールアドレスを変更します\n\nメールアドレス(現在設定): ${email}`
  const passwordContent:string = `ログイン時のパスワードを変更します`
  const cancelMembershipContent:string = `退会すると登録データが消去されますのでご注意ください`

  const handleEditButton = (type:modalModeType):void => {
    setModalMode(type)
    setModalVisible(true)
  }

  useEffect( () => {
    if (!auth.currentUser){return}

    try {
      onAuthStateChanged(auth, (currentUser) =>{
        if ( currentUser !== null ) {
          { setEmail(currentUser.email)}
        }
      })
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        Alert.alert('認証状態の取得に失敗しました:'+error)
      } else {
        Alert.alert('予期せぬエラーが発生しました\n'+error)
      }
    }
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.titleFontType}>アカウント設定</Text>

      <Text style={styles.itemNameFontType}>登録メールアドレス変更</Text>
        <Text style={styles.itemContentsFontType}>
          {emailContent}
        </Text>

        <View style={styles.buttonWrap}>
          <Button label='登録メールアドレス変更' onPress={() => { handleEditButton('eMail') }}/>
        </View>

        <AccountSettingModal
          modalVisible={ modalVisible }
          modalMode={ modalMode }
          setModalVisible={ setModalVisible }
        />

      <Text style={styles.itemNameFontType}>セキュリティ</Text>
        <Text style={styles.itemContentsFontType}>{passwordContent}</Text>
        <View style={styles.buttonWrap}>
          <Button label='パスワード変更' onPress={() => { handleEditButton('passWord') }}/>
        </View>

      <Text style={styles.itemNameFontType}>退会</Text>
        <Text style={styles.itemContentsFontType}>{cancelMembershipContent}</Text>
        <View style={styles.buttonWrap}>
          <Button label='退会する' onPress={() => { handleEditButton('cancelMembership') }}/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor:'#ffffff'
  },
  titleFontType: {
    textAlign:'center',
    fontSize: 32,
    fontWeight: 'normal',
    backgroundColor:'#87CEEB',
    fontFamily: 'Meiryo'
  },
  itemNameFontType: {
    textAlign:'center',
    fontSize: 24,
    fontWeight: 'normal',
    backgroundColor:'#ADD8E6'
  },
  itemContentsFontType: {
    flex: 1,
    paddingTop:32,
    textAlign:'center',
    fontSize: 14,
    fontWeight: 'normal',
    backgroundColor:'white'
  },
  buttonWrap: {
    flex: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  loadingWrap: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  }
})

export default accountSetting
