#!/bin/bash

# Script para crear releases de TPS Intermotors
# Uso: ./scripts/release.sh 1.0.0

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con color
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Validar que se proporcione una versión
if [ -z "$1" ]; then
  print_color "$RED" "❌ Error: Debes proporcionar una versión"
  print_color "$YELLOW" "Uso: ./scripts/release.sh 1.0.0"
  exit 1
fi

VERSION=$1

# Validar formato de versión (debe ser X.Y.Z)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  print_color "$RED" "❌ Error: Formato de versión inválido"
  print_color "$YELLOW" "Debe ser: X.Y.Z (ejemplo: 1.0.0)"
  exit 1
fi

print_color "$BLUE" "🚀 Iniciando proceso de release v$VERSION..."
echo ""

# Verificar que estemos en la rama correcta
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "development" ]; then
  print_color "$YELLOW" "⚠️  Advertencia: No estás en main/development (estás en: $CURRENT_BRANCH)"
  read -p "¿Continuar de todos modos? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_color "$RED" "❌ Release cancelado"
    exit 1
  fi
fi

# Verificar que no haya cambios sin commit
if [ -n "$(git status --porcelain)" ]; then
  print_color "$RED" "❌ Error: Tienes cambios sin commit"
  print_color "$YELLOW" "Commit o descarta los cambios antes de crear un release"
  git status --short
  exit 1
fi

# Verificar que el tag no exista
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  print_color "$RED" "❌ Error: El tag v$VERSION ya existe"
  print_color "$YELLOW" "Usa una versión diferente o elimina el tag existente"
  exit 1
fi

# Actualizar package.json
print_color "$BLUE" "📝 Actualizando package.json..."
npm version $VERSION --no-git-tag-version --allow-same-version

# Actualizar tauri.conf.json
print_color "$BLUE" "📝 Actualizando tauri.conf.json..."
if command -v jq &> /dev/null; then
  TMP_FILE=$(mktemp)
  if jq ".version = \"$VERSION\"" src-tauri/tauri.conf.json > "$TMP_FILE" 2>/dev/null; then
    mv "$TMP_FILE" src-tauri/tauri.conf.json
  else
    rm -f "$TMP_FILE"
    print_color "$YELLOW" "⚠️  jq falló, usando sed..."
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.conf.json
  fi
else
  print_color "$YELLOW" "⚠️  jq no está instalado, usando sed..."
  sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" src-tauri/tauri.conf.json
fi

# Actualizar Cargo.toml
print_color "$BLUE" "📝 Actualizando Cargo.toml..."
sed -i "s/^version = .*/version = \"$VERSION\"/" src-tauri/Cargo.toml

# Mostrar resumen de cambios
print_color "$GREEN" "✅ Versiones actualizadas:"
echo ""
print_color "$YELLOW" "  package.json:           $(grep '"version"' package.json | head -1)"
print_color "$YELLOW" "  tauri.conf.json:        $(grep '"version"' src-tauri/tauri.conf.json)"
print_color "$YELLOW" "  Cargo.toml:             $(grep '^version' src-tauri/Cargo.toml | head -1)"
echo ""

# Confirmar antes de continuar
print_color "$YELLOW" "⚠️  ¿Proceder con el commit y push?"
read -p "Esto creará el tag v$VERSION y disparará el build en GitHub Actions (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  print_color "$RED" "❌ Release cancelado"
  print_color "$YELLOW" "Los archivos fueron modificados pero no se hizo commit"
  exit 1
fi

# Commit
print_color "$BLUE" "📦 Creando commit..."
git add package.json src-tauri/tauri.conf.json src-tauri/Cargo.toml
git commit -m "release: v$VERSION"

# Crear tag
print_color "$BLUE" "🏷️  Creando tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"

# Push
print_color "$BLUE" "📤 Subiendo cambios a GitHub..."
git push origin $CURRENT_BRANCH
git push origin "v$VERSION"

echo ""
print_color "$GREEN" "✅ ¡Release v$VERSION iniciado exitosamente!"
echo ""
print_color "$BLUE" "📊 GitHub Actions está compilando la aplicación..."
print_color "$BLUE" "   Esto tomará aproximadamente 15-20 minutos"
echo ""

# Obtener la URL del repositorio
REPO_URL=$(git config --get remote.origin.url | sed 's/.*github.com[:/]\(.*\)\.git/\1/')

print_color "$GREEN" "🔗 Enlaces útiles:"
print_color "$BLUE" "   Actions:  https://github.com/$REPO_URL/actions"
print_color "$BLUE" "   Releases: https://github.com/$REPO_URL/releases"
echo ""
print_color "$YELLOW" "💡 Tip: Puedes ver el progreso del build en la sección Actions"
