import { View,StyleSheet, Text, Modal, TextInput } from 'react-native'
import { type Dispatch,useState, useEffect} from 'react'
import Button from './Button'

interface Props {
  /** モーダル開閉状態(真の時開く) */
  modalVisible: boolean,
  /** モーダル開閉状態変更用関数 */
  setModalVisible: Dispatch<React.SetStateAction<boolean>>
}

const accountSettingModal = (props: Props):JSX.Element => {
  const { modalVisible, setModalVisible } = props
  const [ emailInput, setInputEmail] = useState('')

  useEffect( () => {
    setModalVisible(props.modalVisible)
  },[props.modalVisible])

  return (
    <Modal
      visible={modalVisible}
      transparent={true} //背景透明に
    >
      {/* モーダル背景 */}
      <View style={styles.modalContainer}>
        {/* UI表示部分 */}
        <View style={{
            height:300,
            backgroundColor:'white',
            paddingVertical: 14,
            paddingHorizontal: 14
          }
        }>
          {/* モーダルタイトル */}
          <Text style={styles.modalTitleFontType}>登録メールアドレス変更</Text>

          <Text style={styles.modalContentsFontType}>変更すると新しいメールアドレスに確認メールが送信されます。</Text>

          <TextInput
            style={styles.modalInput}
            value={emailInput}
            onChangeText={(text) => {setInputEmail(text)}}
            autoCapitalize='none'
            keyboardType='email-address'
            placeholder='Email Address'
            textContentType='emailAddress'
          />

          <View style={styles.modalButtonWrap}>
            {/* Todo:送信処理実装 */}
            <Button
              label='送信'
              buttonStyle={{
                marginTop: 0,
                marginBottom: 0,
                marginRight: 96,
                marginLeft: 0
              }}
              onPress={() => {
                setModalVisible(false)
                setInputEmail('')
            }}/>
            <Button
              label='キャンセル'
              buttonStyle={{
                backgroundColor: '#FF6633'
              }}
              onPress={() => {
                setModalVisible(false)
                setInputEmail('')
              }}/>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#00000080',
    opacity: 1
  },
  modalTitleFontType: {
    paddingBottom: 14,
    textAlign:'center',
    fontSize: 28,
    fontWeight: 'normal',
    fontFamily: 'Meiryo'
  },
  modalContentsFontType:{
    paddingBottom: 14,
    fontSize: 19,
    fontWeight: 'normal',
    backgroundColor:'white'
  },
  modalTextWrap:{
    flex: 1/3,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  modalButtonWrap: {
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
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

export default accountSettingModal
