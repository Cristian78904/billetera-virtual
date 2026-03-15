// frontend/src/screens/DepositScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function DepositScreen({ navigation }) {
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!monto) {
      Alert.alert('Error', 'Ingresá un monto');
      return;
    }

    const montoNum = parseFloat(monto);
    if (montoNum <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a 0');
      return;
    }

    // Confirmación (OPCIÓN 4)
    Alert.alert(
      'Confirmar depósito',
      `¿Estás seguro de depositar $${montoNum.toFixed(2)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => procesarDeposito(montoNum) }
      ]
    );
  };

  const procesarDeposito = async (montoNum) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await fetch('http://localhost:3000/api/transacciones/deposito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ monto: montoNum })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('✅ Depósito exitoso', `Nuevo saldo: $${data.nuevoSaldo}`);
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <ScrollView>
        <View style={styles.container}>
          {/* Header con botón volver */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.title}>Depositar dinero</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="add-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.subtitle}>Agregá saldo a tu cuenta</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Icon name="attach-money" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Monto a depositar"
                placeholderTextColor="#999"
                value={monto}
                onChangeText={setMonto}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.infoBox}>
              <Icon name="info" size={20} color="#4CAF50" />
              <Text style={styles.infoText}>El depósito se acredita instantáneamente</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleDeposit}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Depositar</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 5 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  subtitle: { fontSize: 16, color: '#666' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#f8f9fa' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  infoBox: { flexDirection: 'row', backgroundColor: '#e8f5e9', padding: 12, borderRadius: 8, marginBottom: 15, alignItems: 'center' },
  infoText: { color: '#4CAF50', marginLeft: 10, fontSize: 14 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' }
});