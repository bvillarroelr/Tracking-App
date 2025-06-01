import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginUser } from '../api/auth';
import { pingBackend } from '../api/index'


export default function LoginScreen({ navigation }) 
{
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if(!correo)
        {
            Alert.alert('Error', 'Por favor ingresa tu correo electrónico.');
            return;
        }

        if(!contrasena)
        {
            Alert.alert('Error', 'Por favor ingresa tu contraseña.');
            return;
        }

        // -> debug
        console.log(correo, contrasena);


        try {
            setLoading(true);
            const response = await loginUser({ correo, contrasena });
            
            // -> guardar token en AsyncStorage
            await AsyncStorage.setItem('authToken', response.token);
        
            // -> navegar a mainscreen
            navigation.navigate('Main');
        } catch (error) {
            console.error(error);
            Alert.alert('Error de inicio de sesión', error.message);
        } finally {
            setLoading(false);
        }
    
    };
    
    const handleConnectionTest = async () => {
        try {
            const response = await pingBackend();
            Alert.alert('Conexión exitosa', response.message || 'pong');
        } catch (error) {
            Alert.alert('Error de conexión', error.message);
        }
    };


    return (
        <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput
        placeholder="Correo"
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        keyboardType="email-address"
        />

        <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        />

        <Button title={loading ? "Cargando..." : "Entrar"} onPress={handleLogin} disabled={loading} />
        
        <View style={{ marginVertical: 10 }} />

        <Button title="Probar conexión" onPress={handleConnectionTest} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLink}>
        ¿No tienes cuenta? Regístrate
        </Text>
        </TouchableOpacity>
        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
    },
    registerLink: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center',
    },

})

