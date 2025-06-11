import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';



// -> Pantalla principal de la app móvil
export default function ClientMainScreen({ navigation })
{
    return (
        <View style={styles.container}>

        <Text style={styles.text}>Esta es la pantalla main kumpa</Text>

        <View style={styles.buttonContainer}>
        
        <Button title="Registrar paquete" onPress={() => navigation.navigate('RegisterPackage')} />
        
        <View style={{ marginTop: 10 }} />

        <Button title="Mis envíos" onPress={() => navigation.navigate('ListPackages')} />


        </View>

        </View>



    );

}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0'
    },

    text: {
        fontSize: 18,
        marginBottom: 20,
    },

    buttonContainer: {
        marginTop: 10,
        width: 200,
    },

})
