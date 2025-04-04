import { Alert } from 'react-native'
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import { FirebaseError } from 'firebase/app'
import { signOut } from 'firebase/auth'
import { router } from 'expo-router'
import { auth } from 'config'

// スタイル定数
const COLORS = {
  white: 'white',
  black: 'black',
  silver: 'silver',
  gold: 'gold',
  red: 'red',
  hover: '#cccccc'
} as const

const STYLES = {
  menu: {
    marginLeft: 100,
    paddingBottom: 20
  },
  option: {
    paddingTop: 20,
    activeOpacity: {
      normal: 0.6,
      hover: 0.8
    }
  }
} as const

/**
 * ログアウトボタン押下時の処理
 *
 * @returns {Promise<void>}
 */
const handleSignOut = async (): Promise<void> => {
  try {
    await signOut(auth)
    // ログイン画面に書き換え
    router.replace('/auth/log-in')
  } catch (error) {
    const message = error instanceof FirebaseError
      ? error.message
      : String(error)
    Alert.alert('ログアウトに失敗しました', message)
  }
}

/**
 * 匿名ログイン状態の判定
 */
const isAnonymous = (): boolean => {
  return !auth.currentUser || auth.currentUser.isAnonymous
}

/**
 * ポップアップメニュー
 *
 * @returns {JSX.Element}
 */
const PopupMenu = (): JSX.Element => (
  <Menu>
    <MenuTrigger>
      <FontAwesomeIcon size={30} icon={faBars} color={COLORS.white} />
    </MenuTrigger>
    <MenuOptions customStyles={optionsStyles}>
      <MenuOption
        text='アカウント設定'
        customStyles={isAnonymous() ? optionStylesDisabled : optionStyles}
        onSelect={() => router.push({ pathname: '/auth/accountSetting' })}
        disabled={isAnonymous()}
      />
      <MenuOption
        text='ログアウト'
        customStyles={optionStyles}
        onSelect={handleSignOut}
      />
    </MenuOptions>
  </Menu>
)

// スタイル定義
const optionStyles = {
  optionTouchable: {
    underlayColor: COLORS.hover,
    activeOpacity: STYLES.option.activeOpacity.normal
  },
  optionWrapper: {
    backgroundColor: COLORS.white,
    paddingTop: STYLES.option.paddingTop
  },
  optionText: {
    color: COLORS.black
  }
}

const optionStylesDisabled = {
  optionWrapper: {
    backgroundColor: COLORS.white,
    paddingTop: STYLES.option.paddingTop
  },
  optionText: {
    color: COLORS.silver
  }
}

const optionsStyles = {
  optionsContainer: {
    backgroundColor: COLORS.white,
    marginLeft: STYLES.menu.marginLeft,
    paddingBottom: STYLES.menu.paddingBottom
  },
  optionsWrapper: {
    backgroundColor: COLORS.white
  },
  optionWrapper: {
    backgroundColor: COLORS.white
  },
  optionTouchable: {
    underlayColor: COLORS.hover,
    activeOpacity: STYLES.option.activeOpacity.hover
  },
  optionText: {
    color: COLORS.black
  }
}

export default PopupMenu
