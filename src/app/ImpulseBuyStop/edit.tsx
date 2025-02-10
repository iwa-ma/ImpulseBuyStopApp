import { 
    View, TextInput, StyleSheet, KeyboardAvoidingView
} from 'react-native'
import { router } from 'expo-router'


import Header from '../../components/Header'
import CircleButton from '../../components/CircleButton'
import Icon from '../../components/icon'

const handlePress = (): void => {
    router.back()
}

// 編集画面

const Edit = ():JSX.Element => {
    return (
        <KeyboardAvoidingView style={styles.container} behavior='height'>
            <Header />
            <View style={styles.inputContainer}>
                {/* multiline iOSで上揃えにする為に必要 */}
                <TextInput multiline style={styles.input} value={'買いたい物\nリスト'} />
            </View>
            <CircleButton onPress={handlePress}>
                <Icon name='check' size={40} color='#ffffff' />
            </CircleButton>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        paddingVertical: 32,
        paddingHorizontal: 27,
        flex: 1
    },
    input: {
        flex: 1,
        textAlignVertical: 'top',
        fontSize: 16,
        lineHeight: 24
    }
})

export default Edit