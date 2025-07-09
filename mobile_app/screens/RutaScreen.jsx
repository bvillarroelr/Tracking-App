import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

// Función para decodificar la polilínea
function decode(t, e) {
    for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) {
        a = null, h = 0, i = 0;
        do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
        n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0;
        do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32);
        o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c])
    }
    return d.map(function(t) {
        return {
            latitude: t[0],
            longitude: t[1]
        }
    })
}

export default function RutaScreen({ route }) {
    const { polyline, destinoLat, destinoLng, origen, distancia, duracion } = route.params;

    const originCoords = {
        latitude: -36.83101365, // Latitud de UDEC 
        longitude: -73.03468092, // Longitud de UDEC 
    };

    const destinationCoords = {
        latitude: destinoLat,
        longitude: destinoLng,
    };

    const decodedPolyline = polyline ? decode(polyline) : [];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalles de la Ruta</Text>
            <Text>Origen: {origen}</Text>
            <Text>Destino: {destinoLat}, {destinoLng}</Text>
            <Text>Distancia: {distancia} km</Text>
            <Text>Duración estimada: {duracion} minutos</Text>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: (originCoords.latitude + destinationCoords.latitude) / 2,
                    longitude: (originCoords.longitude + destinationCoords.longitude) / 2,
                    latitudeDelta: Math.abs(originCoords.latitude - destinationCoords.latitude) * 1.5,
                    longitudeDelta: Math.abs(originCoords.longitude - destinationCoords.longitude) * 1.5,
                }}
            >
                <Marker coordinate={originCoords} title="Origen" pinColor="green" />
                <Marker coordinate={destinationCoords} title="Destino" pinColor="red" />

                {decodedPolyline.length > 0 && (
                    <Polyline
                        coordinates={decodedPolyline}
                        strokeColor="blue"
                        strokeWidth={4}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    map: {
        width: Dimensions.get('window').width - 20,
        height: Dimensions.get('window').height / 2,
        marginTop: 20,
    },
});
