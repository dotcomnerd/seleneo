package repository

import (
	"database/sql"
	"time"
)

type Session struct {
	ID           string    `json:"id"`
	SessionToken string    `json:"sessionToken"`
	UserID       string    `json:"userId"`
	Expires      time.Time `json:"expires"`

	User *User `json:"user,omitempty"`
}

type SessionRepo struct {
	db *sql.DB
}