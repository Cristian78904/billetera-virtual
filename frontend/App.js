import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// IMPORTAR PANTALLAS
import ProfileScreen from './src/screens/ProfileScreen';
import HistoryScreen from './src/screens/HistoryScreen';

// Pantalla de Login MEJORADA
function LoginScreen({ onLoginSuccess, onRegisterPress }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('@token', data.token);
        await AsyncStorage.setItem('@user', JSON.stringify(data.user));
        onLoginSuccess();
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header con ícono */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="account-balance-wallet" size={50} color="#007AFF" />
            </View>
            <Text style={styles.appName}>Billetera Virtual</Text>
            <Text style={styles.appSubtitle}>Tu dinero siempre seguro</Text>
          </View>

          {/* Tarjeta de login */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar Sesión</Text>

            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={onRegisterPress}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text style={styles.footerText}>© 2026 Billetera Virtual. Todos los derechos reservados.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Pantalla de Registro MEJORADA
function RegisterScreen({ onRegisterSuccess, onLoginPress }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Éxito', 'Registro exitoso', [
          { text: 'OK', onPress: onRegisterSuccess }
        ]);
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="person-add" size={40} color="#007AFF" />
            </View>
            <Text style={styles.appName}>Crear Cuenta</Text>
            <Text style={styles.appSubtitle}>Completa tus datos</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#999"
                value={nombre}
                onChangeText={setNombre}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña (mínimo 6 caracteres)"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Registrarse</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={onLoginPress}>
                <Text style={styles.registerLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footerText}>© 2026 Billetera Virtual</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Pantalla de Home MEJORADA (SIN BOTÓN DEPOSITAR)
function HomeScreen({ onLogout, onTransferPress, onHistoryPress, onProfilePress }) {
  const [saldo, setSaldo] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [ultimosMovimientos, setUltimosMovimientos] = useState([]);

  React.useEffect(() => {
    loadUserData();
    loadSaldo();
    loadUltimosMovimientos();
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setSaldo(data.saldo);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUltimosMovimientos = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await fetch('http://localhost:3000/api/transacciones/historial?limite=3', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setUltimosMovimientos(data.transacciones);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      <ScrollView style={styles.homeContainer}>
        {/* Header */}
        <View style={styles.homeHeader}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>¡Hola,</Text>
              <Text style={styles.userName}>{userName}!</Text>
            </View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutIcon}>
              <Icon name="logout" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tarjeta de saldo */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Icon name="account-balance" size={24} color="#fff" />
            <Text style={styles.balanceLabel}>Saldo disponible</Text>
          </View>
          {loading ? (
            <ActivityIndicator color="#fff" style={styles.balanceLoader} />
          ) : (
            <Text style={styles.balanceAmount}>${saldo.toFixed(2)}</Text>
          )}
          <View style={styles.cardFooter}>
            <Icon name="credit-card" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.cardNumber}>•••• 1234</Text>
          </View>
        </View>

        {/* Acciones rápidas - SIN DEPOSITAR */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionItem} onPress={onTransferPress}>
            <View style={styles.actionIcon}>
              <Icon name="swap-horiz" size={30} color="#007AFF" />
            </View>
            <Text style={styles.actionLabel}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={onHistoryPress}>
            <View style={styles.actionIcon}>
              <Icon name="history" size={30} color="#FF9800" />
            </View>
            <Text style={styles.actionLabel}>Historial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={onProfilePress}>
            <View style={styles.actionIcon}>
              <Icon name="person" size={30} color="#9C27B0" />
            </View>
            <Text style={styles.actionLabel}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Últimos movimientos */}
        <View style={styles.movementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos movimientos</Text>
            <TouchableOpacity onPress={onHistoryPress}>
              <Text style={styles.viewAll}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {ultimosMovimientos.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="receipt" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No hay movimientos</Text>
              <Text style={styles.emptySubtext}>Tus transacciones aparecerán aquí</Text>
            </View>
          ) : (
            ultimosMovimientos.map((item, index) => (
              <View key={index} style={styles.movementItem}>
                <View style={styles.movementLeft}>
                  <View style={[styles.movementIcon, { backgroundColor: item.tipo === 'transferencia' ? '#e3f2fd' : '#e8f5e9' }]}>
                    <Icon 
                      name={item.tipo === 'transferencia' ? 'swap-horiz' : 'arrow-downward'} 
                      size={20} 
                      color={item.tipo === 'transferencia' ? '#1976D2' : '#4CAF50'} 
                    />
                  </View>
                  <View>
                    <Text style={styles.movementDesc}>{item.descripcion || 'Transferencia'}</Text>
                    <Text style={styles.movementDate}>{new Date(item.fecha).toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text style={[styles.movementAmount, { color: '#F44336' }]}>
                  -${item.monto}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Pantalla de Transferencias
function TransferScreen({ navigation }) {
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!cuentaDestino || !monto) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

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
          monto: parseFloat(monto),
          descripcion
        })
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('✅ Transferencia exitosa', `Nuevo saldo: $${data.nuevoSaldo}`);
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
          <View style={styles.transferHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.transferTitle}>Transferir</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="swap-horiz" size={40} color="#007AFF" />
            </View>
            <Text style={styles.appSubtitle}>Completa los datos</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Cuenta destino"
                placeholderTextColor="#999"
                value={cuentaDestino}
                onChangeText={setCuentaDestino}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="attach-money" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Monto"
                placeholderTextColor="#999"
                value={monto}
                onChangeText={setMonto}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="description" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Descripción"
                placeholderTextColor="#999"
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleTransfer}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Transferir</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// App principal
export default function App() {
  const [screen, setScreen] = useState('login');

  switch (screen) {
    case 'login':
      return <LoginScreen onLoginSuccess={() => setScreen('home')} onRegisterPress={() => setScreen('register')} />;
    case 'register':
      return <RegisterScreen onRegisterSuccess={() => setScreen('login')} onLoginPress={() => setScreen('login')} />;
    case 'transfer':
      return <TransferScreen navigation={{ goBack: () => setScreen('home') }} />;
    case 'history':
      return <HistoryScreen navigation={{ goBack: () => setScreen('home') }} />;
    case 'profile':
      return <ProfileScreen navigation={{ goBack: () => setScreen('home') }} />;
    default:
      return <HomeScreen 
        onLogout={() => setScreen('login')} 
        onTransferPress={() => setScreen('transfer')} 
        onHistoryPress={() => setScreen('history')}
        onProfilePress={() => setScreen('profile')}
      />;
  }
}

// ESTILOS
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  appSubtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 20, textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, paddingHorizontal: 15, marginBottom: 15, backgroundColor: '#f8f9fa' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#99c2ff' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#007AFF', fontSize: 14 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: '#666', fontSize: 16 },
  registerLink: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  footerText: { textAlign: 'center', color: '#999', fontSize: 12, marginTop: 30 },
  
  // Home
  homeContainer: { flex: 1, backgroundColor: '#f8f9fa' },
  homeHeader: { backgroundColor: '#007AFF', padding: 20, paddingTop: 10, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: '#fff', fontSize: 16, opacity: 0.9 },
  userName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  logoutIcon: { padding: 5 },
  balanceCard: { backgroundColor: '#007AFF', margin: 20, padding: 20, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  balanceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  balanceLabel: { color: '#fff', fontSize: 16, marginLeft: 10, opacity: 0.9 },
  balanceLoader: { marginVertical: 20 },
  balanceAmount: { color: '#fff', fontSize: 40, fontWeight: 'bold', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  cardNumber: { color: '#fff', fontSize: 14, marginLeft: 5, opacity: 0.8 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 20 },
  actionItem: { alignItems: 'center', width: '30%' },
  actionIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  actionLabel: { fontSize: 12, color: '#666', textAlign: 'center' },
  movementsSection: { backgroundColor: '#fff', margin: 20, padding: 15, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  viewAll: { color: '#007AFF', fontSize: 14 },
  movementItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  movementLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  movementIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  movementDesc: { fontSize: 16, color: '#333' },
  movementDate: { fontSize: 12, color: '#999', marginTop: 2 },
  movementAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', padding: 30 },
  emptyText: { fontSize: 16, color: '#666', marginTop: 10 },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 5 },
  
  // Transfer
  transferHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  transferTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  backButton: { padding: 5 },
  
  // History
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  historyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  filterContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#fff' },
  filterButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#f8f9fa' },
  filterActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#666', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  historyList: { flex: 1, padding: 15 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  historyLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  historyIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  historyDesc: { fontSize: 16, fontWeight: '500', color: '#333' },
  historyDate: { fontSize: 12, color: '#999', marginTop: 2 },
  historyAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', padding: 50 }
});