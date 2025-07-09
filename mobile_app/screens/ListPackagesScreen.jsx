import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Alert } from 'react-native';

import { paqueteList } from '../api/paquetes'

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListPackagesScreen({ navigation })
{
    const [paquetes, setPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const loadPaquetes = async () => {
        try {
            setLoading(true);

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'No se encontró el token de autenticación.');
                return;
            }

            const data = await paqueteList(token);
            setPaquetes(data);
            setError('');

        } catch (error) {
            console.error('Error cargando paquetes:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadPaquetes();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadPaquetes();
        setRefreshing(false);
    }, []);

    const formatDate = (isoDate) => {
        if (!isoDate) return 'N/A';
        const date = new Date(isoDate);
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.title}>📦 Paquete #{item.paquete_id}</Text>
            <Text>Cliente: {item.usuario_nombre} {item.usuario_apellido}</Text>
            <Text>Peso: {item.paquete_peso} kg</Text>
            <Text>Dimensiones: {item.paquete_dimensiones}</Text>
            <Text>Descripción: {item.paquete_descripcion}</Text>
            <Text>Destino: {item.paquete_destino}</Text>
            <Text>Fecha de envío: {formatDate(item.paquete_fecha_envio)}</Text>
            <Text>Estado: {item.estado_nombre}</Text>

            {item.ruta && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('RutaScreen', {
                        polyline: item.ruta.ruta_polyline,
                        destinoLat: item.ruta.ruta_destino_latitud,
                        destinoLng: item.ruta.ruta_destino_longitud,
                        origen: item.ruta.ruta_origen,
                        distancia: item.ruta.ruta_distancia_km,
                        duracion: item.ruta.ruta_duracion_estimada_min,
                    })}
                >
                    <Text style={styles.buttonText}>Ver Ruta en el Mapa</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.center}>
            <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <FlatList
        data={paquetes}
        keyExtractor={(item) => item.paquete_id.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay paquetes registrados.</Text>}
        />
        </View>
    );
    
}

const styles = StyleSheet.create({
    
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: '#fff',
    },

    card: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        elevation: 2,
    },

    title: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 16,
    },

    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
     
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },

    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },

    button: {
        marginTop: 12,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
