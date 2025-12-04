package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	AppEnv      string
	Database    DatabaseConfig
	LDAP        LDAPConfig
	JWT         JWTConfig
	FrontendURL string
}

type DatabaseConfig struct {
	Path string
}

type LDAPConfig struct {
	Server       string
	Port         int
	BaseDN       string
	BindUsername string
	BindPassword string
}

type JWTConfig struct {
	Secret      string
	ExpiryHours int
}

func Load() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Warning: .env file not found, using environment variables")
	}

	ldapPort, err := strconv.Atoi(getEnv("LDAP_PORT", "389"))
	if err != nil {
		ldapPort = 389
	}

	jwtExpiry, err := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))
	if err != nil {
		jwtExpiry = 24
	}

	return &Config{
		Port:   getEnv("PORT", "8080"),
		AppEnv: getEnv("APP_ENV", "development"),
		Database: DatabaseConfig{
			Path: getEnv("DB_PATH", "./database.db"),
		},
		LDAP: LDAPConfig{
			Server:       getEnv("LDAP_SERVER", "10.101.32.9"),
			Port:         ldapPort,
			BaseDN:       getEnv("LDAP_BASE_DN", "DC=mitrakeluarga,DC=com"),
			BindUsername: getEnv("LDAP_BIND_USERNAME", ""),
			BindPassword: getEnv("LDAP_BIND_PASSWORD", ""),
		},
		JWT: JWTConfig{
			Secret:      getEnv("JWT_SECRET", "your-secret-key"),
			ExpiryHours: jwtExpiry,
		},
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
	}, nil
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
