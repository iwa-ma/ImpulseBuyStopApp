import { Stack } from 'expo-router'
import { MenuProvider } from 'react-native-popup-menu'
import { UnsubscribeProvider } from './UnsubscribeContext'

// スタイル定数
const COLORS = {
  blue: '#0E75FC',
  white: '#ffffff'
}

const FONT_SIZES = {
  header: 22
}

const FONT_WEIGHTS = {
  //headerTitleStyle の警告を出さないために、as constを追加
  bold: 'bold' as const
}

const Layout = (): JSX.Element => {
  return (
    <UnsubscribeProvider>
      <MenuProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.blue
            },
            headerTintColor: COLORS.white,
            headerTitle: '衝動買いストップ',
            headerBackTitle: '戻る',
            headerTitleStyle: {
              fontSize: FONT_SIZES.header,
              fontWeight: FONT_WEIGHTS.bold
            }
          }}
        />
      </MenuProvider>
    </UnsubscribeProvider>
  )
}

export default Layout
