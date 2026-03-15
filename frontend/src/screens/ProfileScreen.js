// frontend/src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
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

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  
  // Datos editables
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  
  // Cambio de password
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await fetch('http://localhost:3000/api/auth/perfil', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setNombre(data.user.nombre);
        setTelefono(data.user.telefono || '');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarPerfil = async () => {
    if (!nombre) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await fetch('http://localhost:3000/api/auth/perfil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, telefono })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('✅ Éxito', 'Perfil actualizado');
        setUser(data.user);
        setEditando(false);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión');
    }
  };

  const handleCambiarPassword = async () => {
    // Validaciones
    if (!passwordActual || !passwordNueva || !confirmPassword) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }

    if (passwordNueva.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordNueva !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('@token');
      console.log('Enviando cambio de password...');
      
      const response = await fetch('http://localhost:3000/api/auth/cambiar-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          passwordActual, 
          passwordNueva 
        })
      });

      const data = await response.json();
      console.log('Respuesta:', data);

      if (data.success) {
        Alert.alert('✅ Éxito', 'Contraseña actualizada correctamente');
        setCambiandoPassword(false);
        setPasswordActual('');
        setPasswordNueva('');
        setConfirmPassword('');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error de conexión: ' + error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity onPress={() => setEditando(!editando)} style={styles.editButton}>
          <Icon name={editando ? "close" : "edit"} size={24} color={editando ? "#F44336" : "#007AFF"} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Datos del usuario */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Información personal</Text>

          <View style={styles.fieldContainer}>
            <Icon name="person" size={20} color="#666" style={styles.fieldIcon} />
            {editando ? (
              <TextInput
                style={styles.fieldInput}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Nombre completo"
              />
            ) : (
              <Text style={styles.fieldText}>{user?.nombre}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Icon name="email" size={20} color="#666" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>{user?.email}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Icon name="phone" size={20} color="#666" style={styles.fieldIcon} />
            {editando ? (
              <TextInput
                style={styles.fieldInput}
                value={telefono}
                onChangeText={setTelefono}
                placeholder="Teléfono (opcional)"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldText}>{user?.telefono || 'No especificado'}</Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Icon name="credit-card" size={20} color="#666" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>Cuenta: {user?.cuenta?.id?.slice(-6) || '••••••'}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Icon name="calendar-today" size={20} color="#666" style={styles.fieldIcon} />
            <Text style={styles.fieldText}>
              Miembro desde: {new Date(user?.fechaRegistro).toLocaleDateString()}
            </Text>
          </View>

          {editando && (
            <TouchableOpacity style={styles.saveButton} onPress={handleActualizarPerfil}>
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            </TouchableOpacity>
          )}
        </View>

       
        {/* Cerrar sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.removeItem('@token');
            await AsyncStorage.removeItem('@user');
            navigation.replace('Login');
          }}
        >
          <Icon name="logout" size={20} color="#fff" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  editButton: { padding: 5 },
  container: { flex: 1, padding: 20 },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: { fontSize: 40, color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 15 },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12
  },
  fieldIcon: { marginRight: 12 },
  fieldText: { fontSize: 16, color: '#333', flex: 1 },
  fieldInput: { fontSize: 16, color: '#333', flex: 1, padding: 0 },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  passwordContainer: { marginTop: 15 },
  passwordButton: {
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  passwordButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  logoutButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10 }
});