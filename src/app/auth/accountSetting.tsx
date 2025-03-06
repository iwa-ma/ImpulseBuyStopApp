import { View,StyleSheet, Text } from 'react-native'
import { useState, useEffect} from 'react'
import { auth } from '../../config'
import { onAuthStateChanged, User } from 'firebase/auth'
import Button from '../../components/Button'
import AccountSettingModal from '../../components/AccountSettingModal'

const handleEditButton = ():void => {
 console.log('handleEditButton')
}


const accountSetting = ():JSX.Element => {
  const [ activeUser, setActiveUser ] = useState<User | null>(null)
  const [ email, setEmail ] = useState<string | null>(null)
  const [ modalVisible, setModalVisible ] = useState(false)
  const emailContent:string = `登録しているメールアドレスを変更します\n\nメールアドレス(現在設定): ${email}`
  const passwordContent:string = `ログイン時のパスワードを変更します`
  const cancelMembershipContent:string = `退会すると登録データが消去されますのでご注意ください`

  useEffect( () => {
    if (!auth.currentUser){return}

    onAuthStateChanged(auth, (currentUser) =>{
      console.log('accountSeting:'+JSON.stringify(currentUser))
      if ( currentUser !== null ) {
        {
          setActiveUser(currentUser)
          setEmail(currentUser.email)

          console.log("activeUser:"+activeUser)
        }
      }
    })
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.titleFontType}>アカウント設定</Text>

      <Text style={styles.itemNameFontType}>登録メールアドレス変更</Text>
        <Text style={styles.itemContentsFontType}>
          {emailContent}
        </Text>

        <View style={styles.buttonWrap}>
          <Button label='登録メールアドレス変更' onPress={() => { setModalVisible(true) }}/>
        </View>

        <AccountSettingModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>

      <Text style={styles.itemNameFontType}>セキュリティ</Text>
        <Text style={styles.itemContentsFontType}>{passwordContent}</Text>
        <View style={styles.buttonWrap}>
          <Button label='パスワード変更' onPress={() => { handleEditButton() }}/>
        </View>

      <Text style={styles.itemNameFontType}>退会</Text>
        <Text style={styles.itemContentsFontType}>{cancelMembershipContent}</Text>
        <View style={styles.buttonWrap}>
          <Button label='退会する' onPress={() => { handleEditButton() }}/>
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
