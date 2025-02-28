import { Alert } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'

import { signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { auth } from '../config'

const handlePress = (): void => {
  signOut(auth)
    .then(() => {
      // ログイン画面に書き換え
      router.replace('/auth/log_in')
    }
    ).
    catch(() => {
      Alert.alert('ログアウトに失敗しました')
    }

    )
}

const PopupMenu = () => {
  return (
    <Menu>
      <MenuTrigger >
        <FontAwesomeIcon size={30} icon={faBars} color="white"/>
      </MenuTrigger>
      <MenuOptions customStyles={optionsStyles}>
        <MenuOption text='アカウント設定' customStyles={optionStyles}/>
        <MenuOption text='ログアウト' customStyles={optionStyles} onSelect={handlePress}/>
      </MenuOptions>
    </Menu>
  )
}

export default PopupMenu

const optionStyles = {
  optionTouchable: {
    underlayColor: 'red',
    activeOpacity: 40
  },
  optionWrapper: {
    backgroundColor: 'white',
    paddingTop: 20
  },
  optionText: {
    color: 'black'
  }
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'white',
    marginLeft:100,
    paddingBottom: 20
  },
  optionsWrapper: {
    backgroundColor: 'white'
  },
  optionWrapper: {
    backgroundColor: 'white'
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 90
  },
  optionText: {
    color: 'black'
  }
}
