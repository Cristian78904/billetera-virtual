// frontend/src/screens/HistoryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HistoryScreen({ navigation }) {
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await fetch('http://localhost:3000/api/transacciones/historial?limite=50', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTransacciones(data.transacciones);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcono = (tipo) => {
    switch (tipo) {
      case 'transferencia': return 'swap-horiz';
      case 'deposito': return 'arrow-downward';
      default: return 'arrow-upward';
    }
  };

  const getColor = (tipo) => {
    switch (tipo) {
      case 'transferencia': return '#FF9800';
      case 'deposito': return '#4CAF50';
      default: return '#F44336';
    }
  };

  const transaccionesFiltradas = transacciones.filter(item => {
    if (filtro === 'todos') return true;
    if (filtro === 'ingresos') return item.tipo === 'deposito';
    return item.tipo !== 'deposito';
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header con botón volver */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filtros */}
      <View style={styles.filterContainer}>
        {['todos', 'ingresos', 'egresos'].map((opcion) => (
          <TouchableOpacity
            key={opcion}
            style={[styles.filterButton, filtro === opcion && styles.filterActive]}
            onPress={() => setFiltro(opcion)}
          >
            <Text style={[styles.filterText, filtro === opcion && styles.filterTextActive]}>
              {opcion.charAt(0).toUpperCase() + opcion.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de transacciones */}
      <ScrollView style={styles.listContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : transaccionesFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="receipt" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No hay movimientos</Text>
          </View>
        ) : (
          transaccionesFiltradas.map((item, index) => (
            <View key={index} style={styles.item}>
              <View style={styles.itemLeft}>
                <View style={[styles.iconCircle, { backgroundColor: getColor(item.tipo) + '20' }]}>
                  <Icon name={getIcono(item.tipo)} size={20} color={getColor(item.tipo)} />
                </View>
                <View>
                  <Text style={styles.itemDesc}>{item.descripcion || item.tipo}</Text>
                  <Text style={styles.itemDate}>{new Date(item.fecha).toLocaleDateString()}</Text>
                </View>
              </View>
              <Text style={[styles.itemAmount, { color: getColor(item.tipo) }]}>
                {item.tipo === 'deposito' ? '+' : '-'}${Math.abs(item.monto).toFixed(2)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff'
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#f8f9fa'
  },
  filterActive: { backgroundColor: '#007AFF' },
  filterText: { color: '#666', fontWeight: '500' },
  filterTextActive: { color: '#fff' },
  listContainer: { flex: 1, padding: 15 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  emptyContainer: { alignItems: 'center', padding: 50 },
  emptyText: { fontSize: 16, color: '#666', marginTop: 10 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  itemDesc: { fontSize: 16, fontWeight: '500', color: '#333' },
  itemDate: { fontSize: 12, color: '#999', marginTop: 2 },
  itemAmount: { fontSize: 16, fontWeight: 'bold' }
});