import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import MainScreen from './screens/MainSreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterPackageScreen  from './screens/RegisterPackageScreen'

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>


        <Stack.Navigator initialRouteName="Login">

        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ title: 'Inicio' }} />   
        <Stack.Screen name="RegisterPackage" component={RegisterPackageScreen} options={{ title: 'Registrar paquete' }} />
    

        </Stack.Navigator>

        </NavigationContainer>



    );
}

