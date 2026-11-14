#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# Elevate privileges automatically.
if [[ "${EUID}" -ne 0 ]]; then
  if ! command -v sudo >/dev/null 2>&1; then
    printf '[ERROR] Run this script as root or install sudo first.\n' >&2
    exit 1
  fi

  exec sudo -- bash "${ROOT_DIR}/$(basename -- "${BASH_SOURCE[0]}")" "$@"
fi

cd "${ROOT_DIR}"
umask 077

INSTALL_OWNER="${SUDO_USER:-root}"
INITIAL_ADMIN_CREATED=0

log() {
  printf '\n\033[1;34m[GRANFORT]\033[0m %s\n' "$1"
}

success() {
  printf '\033[1;32m[OK]\033[0m %s\n' "$1"
}

warn() {
  printf '\033[1;33m[WARN]\033[0m %s\n' "$1"
}

die() {
  printf '\n\033[1;31m[ERROR]\033[0m %s\n' "$1" >&2
  exit 1
}

on_error() {
  local status="$1"
  local line="$2"

  printf '\n\033[1;31m[ERROR]\033[0m Command failed at line %s (exit code %s).\n' \
    "$line" "$status" >&2

  exit "$status"
}

restore_file_ownership() {
  if [[ "${INSTALL_OWNER}" != "root" ]] && id "${INSTALL_OWNER}" >/dev/null 2>&1; then
    local group
    group="$(id -gn "${INSTALL_OWNER}")"

    if [[ -f .env ]]; then
      chown "${INSTALL_OWNER}:${group}" .env || true
    fi
  fi

  [[ ! -f .env ]] || chmod 600 .env || true
}

trap 'on_error "$?" "$LINENO"' ERR
trap restore_file_ownership EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 ||
    die "Required command is missing: $1"
}

apt_get() {
  command apt-get -o DPkg::Lock::Timeout=600 "$@"
}

read_env() {
  local key="$1"
  local value

  value="$(
    awk -F= -v key="$key" '
      $1 == key {
        sub(/^[^=]*=/, "")
        gsub(/^"|"$/, "")
        print
        exit
      }
    ' .env
  )"

  value="${value%$'\r'}"
  printf '%s' "$value"
}

validate_domain() {
  [[ "$1" =~ ^[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$ ]]
}

validate_email() {
  [[ "$1" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]
}

# ---------------------------------------------------------------------------
# Project checks
# ---------------------------------------------------------------------------

check_project_files() {
  log "Checking project files"

  [[ -f compose.yaml ]] ||
    die "compose.yaml is missing."

  [[ -f Dockerfile ]] ||
    die "Dockerfile is missing."

  [[ -f package-lock.json ]] ||
    die "package-lock.json is missing. Generate it with npm install."

  [[ -f caddy/Caddyfile ]] ||
    die "caddy/Caddyfile is missing."

  [[ -f .env.example ]] ||
    die ".env.example is missing."

  success "Required project files are present"
}

# ---------------------------------------------------------------------------
# Host utilities
# ---------------------------------------------------------------------------

install_host_tools() {
  local missing=0

  for command_name in curl openssl getent; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
      missing=1
    fi
  done

  if [[ "$missing" -eq 0 ]]; then
    return
  fi

  log "Installing host utilities"

  apt_get update

  DEBIAN_FRONTEND=noninteractive apt_get install -y \
    ca-certificates \
    curl \
    openssl \
    libc-bin
}

# ---------------------------------------------------------------------------
# Docker installation
# ---------------------------------------------------------------------------

check_conflicting_docker_packages() {
  local conflicts=()
  local package_name
  local package_status

  for package_name in \
    docker.io \
    docker-compose \
    docker-compose-v2 \
    docker-doc \
    docker-buildx \
    podman-docker \
    containerd \
    runc; do

    package_status="$(
      dpkg-query -W -f='${db:Status-Status}' "$package_name" 2>/dev/null || true
    )"

    if [[ "$package_status" == "installed" ]]; then
      conflicts+=("$package_name")
    fi
  done

  if [[ "${#conflicts[@]}" -gt 0 ]]; then
    printf '\nConflicting packages: %s\n' "${conflicts[*]}" >&2

    die "Remove or migrate conflicting packages manually. Existing Docker data will not be removed automatically."
  fi
}

configure_docker_repository() {
  local os_id codename architecture docker_os

  # shellcheck disable=SC1091
  source /etc/os-release

  os_id="${ID:-}"
  architecture="$(dpkg --print-architecture)"

  case "$os_id" in
    ubuntu)
      docker_os="ubuntu"
      codename="${UBUNTU_CODENAME:-${VERSION_CODENAME:-}}"

      case "$codename" in
        jammy|noble|resolute)
          ;;
        *)
          die "Unsupported Ubuntu release: ${codename:-unknown}. Use Ubuntu 22.04, 24.04 or 26.04 LTS."
          ;;
      esac
      ;;

    debian)
      docker_os="debian"
      codename="${VERSION_CODENAME:-}"

      case "$codename" in
        bookworm|trixie)
          ;;
        *)
          die "Unsupported Debian release: ${codename:-unknown}. Use Debian 12 or 13."
          ;;
      esac
      ;;

    *)
      die "Automatic Docker installation supports Ubuntu and Debian. Detected: ${os_id:-unknown}."
      ;;
  esac

  log "Configuring the official Docker repository for ${os_id} ${codename}"

  apt_get update

  DEBIAN_FRONTEND=noninteractive apt_get install -y \
    ca-certificates \
    curl

  install -m 0755 -d /etc/apt/keyrings

  curl -fsSL \
    "https://download.docker.com/linux/${docker_os}/gpg" \
    -o /etc/apt/keyrings/docker.asc

  chmod a+r /etc/apt/keyrings/docker.asc

  cat > /etc/apt/sources.list.d/docker.sources <<SOURCES
Types: deb
URIs: https://download.docker.com/linux/${docker_os}
Suites: ${codename}
Components: stable
Architectures: ${architecture}
Signed-By: /etc/apt/keyrings/docker.asc
SOURCES

  apt_get update
}

ensure_docker() {
  log "Checking Docker Engine and Compose"

  if command -v docker >/dev/null 2>&1 &&
     docker compose version >/dev/null 2>&1; then

    if ! docker info >/dev/null 2>&1; then
      systemctl enable --now docker
    fi

  else
    require_command apt-get

    if ! command -v docker >/dev/null 2>&1; then
      check_conflicting_docker_packages
      configure_docker_repository

      log "Installing Docker Engine, Buildx and Compose Plugin"

      DEBIAN_FRONTEND=noninteractive apt_get install -y \
        docker-ce \
        docker-ce-cli \
        containerd.io \
        docker-buildx-plugin \
        docker-compose-plugin

    else
      configure_docker_repository

      log "Installing Docker Compose Plugin"

      DEBIAN_FRONTEND=noninteractive apt_get install -y \
        docker-compose-plugin
    fi

    require_command systemctl
    systemctl enable --now docker
  fi

  local attempt

  for attempt in $(seq 1 30); do
    if docker info >/dev/null 2>&1 &&
       docker compose version >/dev/null 2>&1; then

      success "Docker Engine and Compose are ready"
      return
    fi

    sleep 1
  done

  die "Docker did not become ready. Check: systemctl status docker"
}

check_environment() {
  log "Checking host environment"

  require_command apt-get
  require_command systemctl

  install_host_tools
  ensure_docker

  success "Host environment is ready"
}

# ---------------------------------------------------------------------------
# Environment configuration
# ---------------------------------------------------------------------------

create_environment() {
  log "First installation: configuring GRANFORT"

  local domain
  local acme_email
  local admin_email
  local default_admin_email

  local postgres_password
  local auth_secret
  local admin_password

  read -r -p "Domain (e.g. example.com): " domain

  domain="${domain,,}"

  validate_domain "$domain" ||
    die "Invalid domain name. Enter a fully qualified domain without scheme or path."

  read -r -p "Email for HTTPS certificates: " acme_email

  validate_email "$acme_email" ||
    die "Invalid ACME email address."

  default_admin_email="admin@${domain}"

  read -r -p "Administrator email [${default_admin_email}]: " admin_email

  admin_email="${admin_email:-$default_admin_email}"
  admin_email="${admin_email,,}"

  validate_email "$admin_email" ||
    die "Invalid administrator email address."

  postgres_password="$(openssl rand -hex 32)"
  auth_secret="$(openssl rand -hex 32)"
  admin_password="$(openssl rand -hex 24)"

  cat > .env <<ENV
DOMAIN=${domain}
ACME_EMAIL=${acme_email}

POSTGRES_USER=granfort
POSTGRES_PASSWORD=${postgres_password}
POSTGRES_DB=granfort

DATABASE_URL=postgresql://granfort:${postgres_password}@db:5432/granfort?schema=public

AUTH_SECRET=${auth_secret}
AUTH_URL=https://${domain}
NEXTAUTH_URL=https://${domain}
AUTH_TRUST_HOST=true

ADMIN_EMAIL=${admin_email}
ADMIN_PASSWORD=${admin_password}
ADMIN_NAME="GRANFORT Administrator"

UPLOAD_DIR=/var/lib/granfort/uploads
ENV

  chmod 600 .env

  success "The .env file has been created"
}

validate_existing_environment() {
  log "Validating .env"

  [[ -f .env ]] ||
    die ".env does not exist."

  local required_variables=(
    DOMAIN
    ACME_EMAIL
    POSTGRES_USER
    POSTGRES_PASSWORD
    POSTGRES_DB
    DATABASE_URL
    AUTH_SECRET
    AUTH_TRUST_HOST
    ADMIN_EMAIL
    ADMIN_PASSWORD
    ADMIN_NAME
    UPLOAD_DIR
  )

  local variable
  local value

  for variable in "${required_variables[@]}"; do
    value="$(read_env "$variable")"

    [[ -n "$value" ]] ||
      die "Missing or empty ${variable} in .env."

    [[ "$value" != replace_* ]] ||
      die "Replace the placeholder value of ${variable} in .env."
  done

  DOMAIN="$(read_env DOMAIN)"
  ACME_EMAIL="$(read_env ACME_EMAIL)"

  DOMAIN="${DOMAIN,,}"

  validate_domain "$DOMAIN" ||
    die "Invalid DOMAIN in .env."

  validate_email "$ACME_EMAIL" ||
    die "Invalid ACME_EMAIL in .env."

  [[ "$(read_env ADMIN_PASSWORD)" =~ ^.{16,}$ ]] ||
    die "ADMIN_PASSWORD must contain at least 16 characters."

  chmod 600 .env

  success "Environment configuration is valid"
}

configure_auth_urls() {
  log "Configuring Auth.js public URLs"

  local public_url="https://${DOMAIN}"

  set_env_value() {
    local key="$1"
    local value="$2"

    if grep -q "^${key}=" .env; then
      sed -i "s|^${key}=.*|${key}=${value}|" .env
    else
      printf '%s=%s\n' "$key" "$value" >> .env
    fi
  }

  set_env_value "AUTH_URL" "$public_url"
  set_env_value "NEXTAUTH_URL" "$public_url"

  chmod 600 .env

  success "Auth.js URLs configured: ${public_url}"
}

# ---------------------------------------------------------------------------
# DNS and container health
# ---------------------------------------------------------------------------

check_dns() {
  log "Checking DNS for ${DOMAIN}"

  if ! getent ahosts "$DOMAIN" >/dev/null 2>&1; then
    die "${DOMAIN} does not resolve. Point its DNS A/AAAA record to this server and try again."
  fi

  warn "DNS resolves. Confirm that it points to this VPS and that inbound ports 80 and 443 are open."
}

wait_for_health() {
  local service="$1"
  local timeout_seconds="${2:-120}"

  local container_id
  local status
  local attempt

  container_id="$(docker compose ps -q "$service")"

  [[ -n "$container_id" ]] ||
    die "Container for ${service} was not created."

  log "Waiting for ${service} to become healthy"

  for attempt in $(seq 1 "$timeout_seconds"); do
    status="$(
      docker inspect \
        --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
        "$container_id" 2>/dev/null || true
    )"

    case "$status" in
      healthy|running)
        success "${service} is ready"
        return
        ;;

      unhealthy|exited|dead)
        docker compose logs --tail=80 "$service" || true
        die "${service} did not start correctly (status: ${status})."
        ;;
    esac

    sleep 1
  done

  docker compose logs --tail=80 "$service" || true

  die "Timed out waiting for ${service}."
}

# ---------------------------------------------------------------------------
# Database initialization and deployment
# ---------------------------------------------------------------------------

run_seed() {
  log "Ensuring the initial administrator and vehicle catalog exist"

  local seed_output

  if ! seed_output="$(
    docker compose --profile tools run --rm --no-deps seed 2>&1
  )"; then
    printf '%s\n' "$seed_output" >&2
    die "Database seed failed. Fix the error and run ./start.sh again."
  fi

  printf '%s\n' "$seed_output"

  if grep -Eq 'Admin .+ created\.' <<< "$seed_output"; then
    INITIAL_ADMIN_CREATED=1
  fi

  success "Seed completed"
}

deploy() {
  log "Validating Compose configuration"

  docker compose config --quiet

  log "Building application and migration images"

  docker compose build app migrate

  log "Starting PostgreSQL"

  docker compose up -d db

  log "Applying database migrations"

  docker compose run --rm migrate

  success "Database migrations completed"

  run_seed

  log "Starting Next.js"

  docker compose up -d --no-deps app

  wait_for_health app 120

  log "Starting Caddy"

  docker compose up -d --no-deps caddy
}

# ---------------------------------------------------------------------------
# HTTPS verification
# ---------------------------------------------------------------------------

check_https() {
  log "Waiting for HTTPS at https://${DOMAIN}"

  warn "Certificate issuance requires correct public DNS and accessible ports 80/443."

  local attempt

  for attempt in $(seq 1 60); do
    if curl \
      --fail \
      --silent \
      --show-error \
      --max-time 10 \
      --output /dev/null \
      "https://${DOMAIN}/" 2>/dev/null; then

      success "HTTPS is available"
      return
    fi

    sleep 5
  done

  docker compose logs --tail=100 caddy app || true

  die "HTTPS did not become available. Check DNS, firewall rules and Caddy logs, then run ./start.sh again."
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

main() {
  check_project_files
  check_environment

  if [[ ! -f .env ]]; then
    create_environment
  fi

  validate_existing_environment

  configure_auth_urls

  check_dns

  deploy
  check_https

  printf '\n\033[1;32m====================================\033[0m\n'
  printf '\033[1;32m GRANFORT is ready!\033[0m\n'
  printf '\033[1;32m====================================\033[0m\n\n'

  printf 'Website: https://%s\n' "$DOMAIN"
  printf 'Admin:   https://%s/admin\n' "$DOMAIN"

  if [[ "$INITIAL_ADMIN_CREATED" -eq 1 ]]; then
    printf '\nInitial administrator credentials:\n'
    printf 'Email:    %s\n' "$(read_env ADMIN_EMAIL)"
    printf 'Password: %s\n' "$(read_env ADMIN_PASSWORD)"
    printf '\nSave this password. It will not be displayed again.\n'
  else
    printf '\nThe administrator account already existed.\n'
    printf 'Use the existing administrator credentials.\n'
  fi
}

main "$@"
