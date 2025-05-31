import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



// -> Pantalla principal de la app móvil
export default function MainScreen()
{
    return (
        <View style={styles.container}>

            <Text style={styles.text}>Esta es la pantalla main kumpa</Text>

        </View>



    );

}

const styles = StyleSheet.create({
    
    container: {
 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0'

    }




})
