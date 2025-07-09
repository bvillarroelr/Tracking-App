import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { listaPaquetesConRuta, marcarComoEntregado } from '../api/paquetes';

export default function DriverMainScreen() {
    const navigation = useNavigation();
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPaquetes = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }
            const data = await listaPaquetesConRuta(token);
            setPaquetes(data);
            setError('');
        } catch (error) {
            console.error('Error cargando paquetes:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // useFocusEffect para recargar los datos cada vez que la pantalla entra en foco
    useFocusEffect(
        React.useCallback(() => {
            loadPaquetes();
        }, [])
    );

    const handleMarcarEntregado = async (paqueteId) => {
        Alert.alert(
            "Confirmar Entrega",
            "¿Está seguro de que desea marcar este paquete como entregado?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await marcarComoEntregado(paqueteId, token);
                            Alert.alert('Éxito', 'Paquete marcado como entregado.');
                            // Actualizar la lista localmente para reflejar el cambio
                            setPaquetes(prevPaquetes =>
                                prevPaquetes.map(p =>
                                    p.paquete_id === paqueteId ? { ...p, estado_nombre: 'Entregado' } : p
                                )
                            );
                        } catch (err) {
                            Alert.alert('Error', 'No se pudo actualizar el estado del paquete.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.label}>ID:</Text>
            <Text>{item.paquete_id}</Text>

            <Text style={styles.label}>Cliente:</Text>
            <Text>{item.usuario_nombre} {item.usuario_apellido}</Text>

            <Text style={styles.label}>Destino:</Text>
            <Text>{item.paquete_destino}</Text>

            <Text style={styles.label}>Estado:</Text>
            <Text style={{ color: item.estado_nombre === 'Entregado' ? 'green' : 'orange', fontWeight: 'bold' }}>
                {item.estado_nombre}
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('RutaScreen', {
                    polyline: item.ruta_polyline,
                    destinoLat: item.ruta_destino_latitud,
                    destinoLng: item.ruta_destino_longitud,
                    origen: item.ruta_origen,
                    distancia: item.ruta_distancia_km,
                    duracion: item.ruta_duracion_estimada_min,
                })}
            >
                <Text style={styles.buttonText}>Ver Ruta</Text>
            </TouchableOpacity>

            {item.estado_nombre !== 'Entregado' && (
                <TouchableOpacity
                    style={[styles.button, styles.deliverButton]}
                    onPress={() => handleMarcarEntregado(item.paquete_id)}
                >
                    <Text style={styles.buttonText}>Entregar Paquete</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📦 Paquetes con Ruta Asignada</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : paquetes.length === 0 ? (
                <Text>No hay paquetes con ruta.</Text>
            ) : (
                <FlatList
                    data={paquetes}
                    keyExtractor={(item) => item.paquete_id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    list: {
        paddingBottom: 30,
    },
    card: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 5,
    },
    error: {
        color: 'red',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    deliverButton: {
        backgroundColor: '#28a745', // Color verde para el botón de entregar
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});