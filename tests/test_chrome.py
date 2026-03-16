from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time

print("=" * 50)
print("🚀 TEST DE LOGIN - BILLETERA VIRTUAL")
print("=" * 50)

try:
    # ============================================
    # 1. ABRIR CHROME
    # ============================================
    print("\n📌 Abriendo Chrome...")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    driver.maximize_window()
    print("✅ Chrome listo")

    # ============================================
    # 2. IR A LA APP
    # ============================================
    print("\n📌 Yendo a la billetera virtual...")
    driver.get("http://localhost:8081")
    time.sleep(2)
    print("✅ Página cargada")

    # ============================================
    # 3. LOGIN
    # ============================================
    print("\n🔐 INICIANDO SESIÓN...")
    
    # Completar email y contraseña
    inputs = driver.find_elements(By.TAG_NAME, "input")
    inputs[0].send_keys("1234@gmail.com")
    inputs[1].send_keys("123456")
    print("✅ Email y contraseña completados")
    
    # Hacer click en botón de login
    boton_login = driver.find_element(By.CSS_SELECTOR, "[data-testid='login-button']")
    time.sleep(1)
    boton_login.click()
    print("✅ Click en botón de login")
    
    # Esperar para ver el resultado
    print("\n⏳ Esperando 5 segundos para ver el resultado...")
    time.sleep(5)
    
    print("\n✅ LOGIN COMPLETADO")

except Exception as e:
    print(f"\n❌ ERROR: {e}")

finally:
    print("\n" + "=" * 50)
    respuesta = input("¿Cerrar navegador? (s/n): ")
    if respuesta.lower() == "s":
        try:
            driver.quit()
            print("👋 Navegador cerrado")
        except:
            pass
    print("=" * 50)