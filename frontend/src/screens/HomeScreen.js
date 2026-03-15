// En HomeScreen.js, reemplaza TODO con esto:

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUserData();
    loadSaldo();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('@user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.nombre || 'Usuario');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSaldo = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      
      const response = await fetch('http://localhost:3000/api/transacciones/saldo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSaldo(data.saldo);
      }
    } catch (error) {
      console.error('Error cargando saldo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>👋 Hola, {userName}</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo disponible</Text>
        {loading ? (
          <Text style={styles.cardAmount}>Cargando...</Text>
        ) : (
          <Text style={styles.cardAmount}>${saldo.toFixed(2)}</Text>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Transfer')}
        >
          <Text style={styles.actionText}>Transferir</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.actionText}>Historial</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('@token');
          await AsyncStorage.removeItem('@user');
          navigation.replace('Login');
        }}
      >
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 40 },
  welcome: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  card: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardLabel: { fontSize: 16, color: '#666' },
  cardAmount: { fontSize: 36, fontWeight: 'bold', color: '#007AFF', marginTop: 10 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginTop: 20 },
  actionButton: { backgroundColor: 'white', padding: 15, borderRadius: 10, alignItems: 'center', flex: 1, marginHorizontal: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  actionText: { color: '#007AFF', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#ff3b30', margin: 20, padding: 15, borderRadius: 10, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});