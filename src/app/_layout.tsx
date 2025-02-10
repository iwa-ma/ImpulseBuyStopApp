import { Stack } from 'expo-router'

const Layout = ():JSX.Element => {
    return <Stack screenOptions={{
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
}

export default Layout