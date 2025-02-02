package repository

import (
	"database/sql"
	"time"
)

type VerificationToken struct {
	Identifier string    `json:"identifier"`
	Token      string    `json:"token"`
	Expires    time.Time `json:"expires"`
}

type VerificationTokenRepo struct {
	db *sql.DB
}
