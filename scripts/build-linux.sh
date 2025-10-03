#!/bin/bash

# Script para compilar TPS Intermotors para Linux (Manjaro/Arch)
# Uso: ./scripts/build-linux.sh

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

print_color "$BLUE" "🔨 Compilando TPS Intermotors para Linux..."
echo ""

# Verificar dependencias
print_color "$BLUE" "📦 Verificando dependencias..."

MISSING_DEPS=()

if ! command -v npm &> /dev/null; then
    MISSING_DEPS+=("nodejs npm")
fi

if ! command -v cargo &> /dev/null; then
    MISSING_DEPS+=("rust")
fi

if ! pkg-config --exists webkit2gtk-4.1; then
    MISSING_DEPS+=("webkit2gtk-4.1")
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    print_color "$RED" "❌ Faltan dependencias:"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "  - $dep"
    done
    echo ""
    print_color "$YELLOW" "Instala con:"
    print_color "$YELLOW" "  sudo pacman -S nodejs npm rust webkit2gtk-4.1"
    exit 1
fi

print_color "$GREEN" "✅ Todas las dependencias están instaladas"
echo ""

# Compilar frontend
print_color "$BLUE" "🎨 Compilando frontend..."
npm run build

# Compilar con Tauri
print_color "$BLUE" "🦀 Compilando Rust + Tauri..."
cargo tauri build

# Mostrar resultados
print_color "$GREEN" "✅ Compilación completada!"
echo ""
print_color "$BLUE" "📦 Archivos generados:"

BUNDLE_DIR="src-tauri/target/release/bundle"

if [ -d "$BUNDLE_DIR/deb" ]; then
    print_color "$GREEN" "  DEB: $BUNDLE_DIR/deb/"
    ls -lh "$BUNDLE_DIR/deb"/*.deb 2>/dev/null || true
fi

if [ -d "$BUNDLE_DIR/appimage" ]; then
    print_color "$GREEN" "  AppImage: $BUNDLE_DIR/appimage/"
    ls -lh "$BUNDLE_DIR/appimage"/*.AppImage 2>/dev/null || true
fi

if [ -d "$BUNDLE_DIR/rpm" ]; then
    print_color "$GREEN" "  RPM: $BUNDLE_DIR/rpm/"
    ls -lh "$BUNDLE_DIR/rpm"/*.rpm 2>/dev/null || true
fi

echo ""
print_color "$YELLOW" "💡 Para instalar:"
print_color "$YELLOW" "  DEB (Debian/Ubuntu): sudo dpkg -i file.deb"
print_color "$YELLOW" "  RPM (Fedora/RHEL): sudo rpm -i file.rpm"
print_color "$YELLOW" "  Arch: sudo pacman -U file.pkg.tar.zst"
print_color "$YELLOW" "  AppImage: chmod +x file.AppImage && ./file.AppImage"
