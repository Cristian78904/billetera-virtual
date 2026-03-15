// Pantalla de Registro (con botón de prueba)
function RegisterScreen({ onRegister, onLoginPress }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función de prueba
  const testBackend = async () => {
    try {
      console.log('Probando conexión...');
      const response = await fetch('http://localhost:3000/api/test');
      const data = await response.json();
      alert('✅ Conexión OK: ' + JSON.stringify(data));
    } catch (error) {
      alert('❌ Error: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Crear Cuenta</Text>
      
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {/* Botón de prueba (NUEVO) */}
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#34C759', marginBottom: 10 }]} 
          onPress={testBackend}
        >
          <Text style={styles.buttonText}>🔧 Probar Conexión</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => onRegister()}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={onLoginPress}>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}