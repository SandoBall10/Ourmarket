package com.inmobiliaria.inmobiliariaspring.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class DatabaseBootstrap {

    private static final Logger log = LoggerFactory.getLogger(DatabaseBootstrap.class);

    private DatabaseBootstrap() {}

    public static void ensureDatabaseExists() {
        String jdbcUrl = firstEnv(
                "jdbc:postgresql://localhost:5432/marketplaceinmobiliario",
                "DB_URL",
                "SPRING_DATASOURCE_URL");
        String username = firstEnv("postgres", "DB_USERNAME", "SPRING_DATASOURCE_USERNAME");
        String password = firstEnv("12345", "DB_PASSWORD", "SPRING_DATASOURCE_PASSWORD");
        String dbName = extractDatabaseName(jdbcUrl);
        if (dbName == null || !dbName.matches("[a-zA-Z0-9_]+")) {
            throw new IllegalStateException("Nombre de base de datos inválido en DB_URL: " + jdbcUrl);
        }

        String adminUrl = jdbcUrl.replaceFirst("/[^/]+$", "/postgres");
        try {
            Class.forName("org.postgresql.Driver");
            try (Connection connection = DriverManager.getConnection(adminUrl, username, password);
                 Statement statement = connection.createStatement();
                 ResultSet existing = statement.executeQuery(
                         "SELECT 1 FROM pg_database WHERE datname = '" + dbName + "'")) {
                if (!existing.next()) {
                    statement.executeUpdate("CREATE DATABASE " + dbName);
                    log.info("Base de datos '{}' creada automáticamente", dbName);
                } else {
                    log.info("Base de datos '{}' ya existe", dbName);
                }
            }
        } catch (Exception ex) {
            throw new IllegalStateException(
                    "No se pudo crear o verificar PostgreSQL en " + adminUrl
                            + ". ¿Está el servicio en marcha? " + ex.getMessage(),
                    ex);
        }
    }

    private static String extractDatabaseName(String jdbcUrl) {
        int slash = jdbcUrl.lastIndexOf('/');
        if (slash < 0 || slash == jdbcUrl.length() - 1) {
            return null;
        }
        String tail = jdbcUrl.substring(slash + 1);
        int query = tail.indexOf('?');
        return query >= 0 ? tail.substring(0, query) : tail;
    }

    private static String firstEnv(String fallback, String... keys) {
        for (String key : keys) {
            String value = System.getenv(key);
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return fallback;
    }
}
