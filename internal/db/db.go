package db

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	_ "github.com/lib/pq"
)

func New(connStr, maxIdleTime string, maxConn, maxIdleConns int) (*sql.DB, error) {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println("Error opening connection to db: ", err)
		return nil, err
	}

	db.SetMaxOpenConns(maxConn)
	db.SetMaxIdleConns(maxIdleConns)

	idleTime, err := time.ParseDuration(maxIdleTime)
	if err != nil {
		return nil, err
	}

	db.SetConnMaxIdleTime(idleTime)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, err
	}

	return db, nil
}