import { Stack } from 'expo-router'
import { MenuProvider } from 'react-native-popup-menu'

const Layout = ():JSX.Element => {
  return (
    <MenuProvider>
      <Stack screenOptions={{
      headerStyle: {
          backgroundColor: '#0E75FC'
      },
      headerTintColor: '#ffffff',
      headerTitle: 'Impulse Buy Stop App',
      headerBackTitle: 'Back',
      headerTitleStyle: {
          fontSize: 22,
          fontWeight:'bold'
      }
     }}/>
    </MenuProvider>
  )
}

export default Layout
