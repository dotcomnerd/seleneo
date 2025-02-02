package repository

import "database/sql"

type Account struct {
	ID                string  `json:"id"`
	UserID            string  `json:"userId"`
	Type              string  `json:"type"`
	Provider          string  `json:"provider"`
	ProviderAccountID string  `json:"providerAccountId"`
	RefreshToken      *string `json:"refreshToken,omitempty"`
	AccessToken       *string `json:"accessToken,omitempty"`
	ExpiresAt         *int    `json:"expiresAt,omitempty"`
	TokenType         *string `json:"tokenType,omitempty"`
	Scope             *string `json:"scope,omitempty"`
	IDToken           *string `json:"idToken,omitempty"`
	SessionState      *string `json:"sessionState,omitempty"`

	User *User `json:"user,omitempty"`
}

type AccountRepo struct {
	db *sql.DB
}
