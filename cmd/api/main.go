package main

import (
	"fmt"

	"github.com/dotcomnerd/seleneo/internal/db"
	"github.com/dotcomnerd/seleneo/internal/env"
	"github.com/dotcomnerd/seleneo/internal/repository"
	"github.com/joho/godotenv"

	"go.uber.org/zap"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	cfg := config{
		addr: env.GetString("API_ADDR", ":8080"),
		env:  env.GetString("ENV", "development"), //might not be needed (find a way to switch to vault soon)
		db: dbConfig{
			connStr:      env.GetString("DB_ADDR", "postgresql://devinechinemere:postgres123@localhost:5432/seleneo_db?sslmode=disable"),
			maxIdleTime:  env.GetString("DB_MAX_IDLE_TIME", "15m"),
			maxConn:      env.GetInt("DB_MAX_CONN", 25),
			maxIdleConns: env.GetInt("DB_MAX_IDLE_CONN", 25),
		},
	}

	logger := zap.Must(zap.NewProduction()).Sugar()
	defer logger.Sync()

	db, err := db.New(cfg.db.connStr, cfg.db.maxIdleTime, cfg.db.maxConn, cfg.db.maxIdleConns)
	if err != nil {
		logger.Fatalf("cannot connect to db: %v", err)
	}

	defer db.Close()
	logger.Info("database connection established")

	repo := repository.New(db)

	app := &application{
		config: cfg,
		logger: logger,
		repo:   repo,
	}

	mux := app.mount()

	logger.Fatal(app.run(mux))
}
