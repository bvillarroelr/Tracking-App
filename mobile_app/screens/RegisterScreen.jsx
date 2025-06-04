import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import { registerUser } from '../api/auth';

export default function RegisterScreen({ navigation }) 
{
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [tipo, setTipo] = useState('cliente')

    const [loading, setLoading] = useState(false);
    
    const handleRegister = async () => {
        if (contrasena != confirmarContrasena)
        {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser({
                nombre,
                correo,
                contrasena,
                tipo
            });
            
            // -> debug
            console.log(nombre, correo, contrasena, tipo);           


            Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
            navigation.navigate('Login')
        } catch (error) {
            Alert.alert('Error en registro', error.message);
        } finally {
            setLoading(false);
        }

    };
    
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Registro de usuario</Text>

        <TextInput
        placeholder="Nombre"
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        />

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

        <TextInput
        placeholder="Confirmar contraseña"
        style={styles.input}
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
        secureTextEntry
        />

        <Button
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={handleRegister}
        disabled={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
        </View>

    );

}

const styles = StyleSheet.create({
    
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
    },
    loginLink: {
        marginTop: 15,
        color: 'blue',
        textAlign: 'center',
    },

});
