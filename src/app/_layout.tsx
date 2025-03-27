import { Stack } from 'expo-router'
import { MenuProvider } from 'react-native-popup-menu'
import { UnsubscribeProvider } from './UnsubscribeContext'

const Layout = ():JSX.Element => {
  return (
    <UnsubscribeProvider>
      <MenuProvider>
        <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#0E75FC'
        },
        headerTintColor: '#ffffff',
        headerTitle: '衝動買いストップ',
        headerBackTitle: '戻る',
        headerTitleStyle: {
            fontSize: 22,
            fontWeight:'bold'
        }
      }}/>
      </MenuProvider>
    </UnsubscribeProvider>
  )
}

export default Layout
