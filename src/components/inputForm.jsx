import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../global/colors';

const InputForm = ({
    label, 
    onChange, 
    error = "",
    isSecure = false
}) => {
    const [input, setInput] = useState("");
    const onChangeText = (text) => {
        setInput(text)
        onChange(text)
    }
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.subtitle}>{label}</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        placeholderTextColor={colors.white}
      />
      {error ? 
        <Text style={styles.error}>
            {error}
        </Text>
        :
        null
      }
    </View>
  )
}

export default InputForm

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%'
    },
    subtitle: {
        width: '90%',
        fontSize: 16,
        fontFamily: 'CourierL',
        color: colors.textHighContrast,
        marginBottom: 8,
    },
    error: {
        paddingTop: 2,
        fontSize: 14,
        color: colors.error,
        fontFamily: 'Josefin',
        fontStyle: 'italic',
        width: '90%',
    },
    input: {
        width: '90%',
        borderWidth: 0,
        borderBottomWidth: 2,
        borderBottomColor: colors.accentHighContrast,
        padding: 8,
        fontFamily: 'CourierL',
        fontSize: 16,
        color: colors.black,
        backgroundColor: colors.backgroundMediumContrast,
        borderRadius: 8,
    }
})
