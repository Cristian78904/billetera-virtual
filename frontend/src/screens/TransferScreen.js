// frontend/src/screens/TransferScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TransferScreen({ navigation }) {
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  // Función para validar formato de email
  const isValidEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };

  // Función para validar ID de MongoDB (24 caracteres hexadecimales)
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const handleTransfer = async () => {
    // Validaciones básicas
    if (!cuentaDestino || !monto) {
      Alert.alert('Error', 'Completa cuenta destino y monto');
      return;
    }

    const montoNum = parseFloat(monto);
    if (montoNum <= 0) {
      Alert.alert('Error', 'El monto debe ser mayor a 0');
      return;
    }

    // Validar formato de cuenta destino (OPCIÓN 3)
    if (!isValidEmail(cuentaDestino) && !isValidObjectId(cuentaDestino)) {
      Alert.alert(
        'Error', 
        'La cuenta destino debe ser un email válido o un ID de MongoDB (24 caracteres)'
      );
      return;
    }

    // CONFIRMACIÓN ANTES DE TRANSFERIR (OPCIÓN 4)
    Alert.alert(
      'Confirmar transferencia',
      `¿Estás seguro de transferir $${montoNum.toFixed(2)} a ${cuentaDestino}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => procesarTransferencia(montoNum) }
      ]
    );
  };

  const procesarTransferencia = async (montoNum) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('@token');
      
      const response = await fetch('http://localhost:3000/api/transacciones/transferir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cuentaDestino,
          monto: montoNum,
          descripcion
        })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          '✅ Transferencia exitosa',
          `Se transfirieron $${montoNum.toFixed(2)}\nNuevo saldo: $${data.nuevoSaldo}`,
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('❌ Error', data.message);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {/* Header con botón volver */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={styles.title}>💰 Transferir dinero</Text>
          </View>

          {/* Info de formato */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📌 Formato de cuenta destino:</Text>
            <Text style={styles.infoText}>• Email: usuario@email.com</Text>
            <Text style={styles.infoText}>• ID MongoDB: 24 caracteres (ej: 65f3a1b2c3d4e5f6g7h8i9j0)</Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Email o ID de cuenta destino"
            value={cuentaDestino}
            onChangeText={setCuentaDestino}
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Monto"
            value={monto}
            onChangeText={setMonto}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleTransfer}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Transferir</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { flexGrow: 1, padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  header: { marginBottom: 20 },
  backButton: { marginBottom: 10 },
  backButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  infoBox: { backgroundColor: '#e3f2fd', padding: 12, borderRadius: 8, marginBottom: 20 },
  infoTitle: { fontSize: 14, fontWeight: 'bold', color: '#1976D2', marginBottom: 5 },
  infoText: { fontSize: 12, color: '#1976D2', marginLeft: 5 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16, backgroundColor: '#f8f9fa' },
  textArea: { height: 80 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#99c2ff' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});