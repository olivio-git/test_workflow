#!/bin/bash

# Script para compilar TPS Intermotors para Windows desde Linux
# Uso: ./scripts/build-windows.sh [msi|nsis|app|all]

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Validar que estemos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "src-tauri" ]; then
    print_color "$RED" "❌ Error: Debes ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Determinar target
TARGET_TYPE=${1:-all}

print_color "$BLUE" "🔨 Compilando TPS Intermotors para Windows..."
print_color "$YELLOW" "Target: $TARGET_TYPE"
echo ""

# Verificar dependencias
print_color "$BLUE" "📦 Verificando dependencias..."

if ! command -v x86_64-w64-mingw32-gcc &> /dev/null; then
    print_color "$RED" "❌ Error: x86_64-w64-mingw32-gcc no está instalado"
    print_color "$YELLOW" "Instala con: sudo pacman -S mingw-w64-gcc"
    exit 1
fi

# Compilar frontend
print_color "$BLUE" "🎨 Compilando frontend..."
npm run build

# Configurar targets en tauri.conf.json según el tipo
case $TARGET_TYPE in
    msi)
        print_color "$BLUE" "📦 Generando instalador MSI..."
        TARGETS='["msi"]'
        ;;
    nsis)
        print_color "$BLUE" "📦 Generando instalador NSIS..."
        TARGETS='["nsis"]'
        ;;
    app)
        print_color "$BLUE" "📦 Generando app portable..."
        TARGETS='["app"]'
        ;;
    all)
        print_color "$BLUE" "📦 Generando todos los formatos..."
        TARGETS='["msi", "nsis", "app"]'
        ;;
    *)
        print_color "$RED" "❌ Error: Tipo inválido. Usa: msi, nsis, app, o all"
        exit 1
        ;;
esac

# Actualizar targets temporalmente
ORIGINAL_CONF=$(cat src-tauri/tauri.conf.json)
jq ".bundle.targets = $TARGETS" src-tauri/tauri.conf.json > src-tauri/tauri.conf.json.tmp
mv src-tauri/tauri.conf.json.tmp src-tauri/tauri.conf.json

# Compilar con Tauri
print_color "$BLUE" "🦀 Compilando Rust + Tauri..."
RUSTFLAGS="-C linker=x86_64-w64-mingw32-gcc" \
cargo tauri build --target x86_64-pc-windows-gnu

# Restaurar configuración original
echo "$ORIGINAL_CONF" > src-tauri/tauri.conf.json

# Mostrar resultados
print_color "$GREEN" "✅ Compilación completada!"
echo ""
print_color "$BLUE" "📦 Archivos generados:"

BUNDLE_DIR="src-tauri/target/x86_64-pc-windows-gnu/release/bundle"

if [ -d "$BUNDLE_DIR/msi" ]; then
    print_color "$GREEN" "  MSI: $BUNDLE_DIR/msi/"
    ls -lh "$BUNDLE_DIR/msi"/*.msi 2>/dev/null || true
fi

if [ -d "$BUNDLE_DIR/nsis" ]; then
    print_color "$GREEN" "  NSIS: $BUNDLE_DIR/nsis/"
    ls -lh "$BUNDLE_DIR/nsis"/*-setup.exe 2>/dev/null || true
fi

if [ -d "$BUNDLE_DIR/app" ]; then
    print_color "$GREEN" "  APP: $BUNDLE_DIR/app/"
    ls -lh "$BUNDLE_DIR/app"/*.exe 2>/dev/null || true
fi

echo ""
print_color "$YELLOW" "💡 Tip: Copia los archivos a una máquina Windows para probarlos"
print_color "$YELLOW" "💡 O usa Wine: wine $BUNDLE_DIR/msi/*.msi"
