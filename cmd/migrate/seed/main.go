package main

import (
	"log"

	"github.com/dotcomnerd/seleneo/internal/db"
	"github.com/dotcomnerd/seleneo/internal/env"
	"github.com/dotcomnerd/seleneo/internal/repository"
)

func main() {
	addr := env.GetString("DB_ADDR", "postgresql://devinechinemere:postgres123@localhost:5432/seleneo_db?sslmode=disable")
	conn, err := db.New(addr, "15m", 3, 3)
	if err != nil {
		log.Fatal(err)
	}

	defer conn.Close()

	store := repository.New(conn)

	_ = store

	// TODO: implement dummy data
	// db.Seed(store, conn)
}
