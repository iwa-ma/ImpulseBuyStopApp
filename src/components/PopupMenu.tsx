import { Alert } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FirebaseError } from 'firebase/app'
import { signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { auth } from 'config'

/**
 * ログアウトボタン押下時の処理
 *
 * @returns {Promise<void>}
 */
const handlePress = async (): Promise<void> => {
  try {
    await signOut(auth)
    // ログイン画面に書き換え
    router.replace('/auth/log-in')
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      const { message }: { message: string } = error
      Alert.alert('ログアウトに失敗しました\n'+message)
    } else {
      Alert.alert('ログアウトに失敗しました\n'+error)
    }
  }
}

/** 匿名ログイン状態を判定する */
const isAnonymous = () :boolean => {
  // ログイン中ユーザーが取得でない場合は処理を実行せずに終了する
  if(!auth.currentUser) { return true }

  return auth.currentUser?.isAnonymous
}

/**
 * ポップアップメニュー
 *
 * @returns {JSX.Element}
 */
const PopupMenu = () => {
  return (
    <Menu>
      <MenuTrigger >
        <FontAwesomeIcon size={30} icon={faBars} color="white"/>
      </MenuTrigger>
      <MenuOptions customStyles={optionsStyles}>
        <MenuOption
          text='アカウント設定'
          customStyles={isAnonymous() ? optionStylesDisabled :optionStyles}
          onSelect={() =>router.push({ pathname: '/auth/accountSetting'})}
          disabled={isAnonymous()}
        />
        <MenuOption
          text='ログアウト'
          customStyles={optionStyles} onSelect={handlePress}
        />
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

/** アカウント設定無効時のスタイル設定 */
const optionStylesDisabled = {
  optionWrapper: {
    backgroundColor: 'white',
    paddingTop: 20
  },
  optionText: {
    color: 'silver'
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
