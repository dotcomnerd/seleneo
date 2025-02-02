package repository

import (
	"context"
	"database/sql"
	"time"
)

var(
	QueryTimeout = 5 * time.Second
	DeleteQueryTimeout = 15 * time.Second
)

type Storage struct {
	User interface{
		GetUserById(context.Context, string) (*User, error)
		DeleteUser(context.Context, string) error
	}
	UserImage interface{
		SaveOrUpdateUserImage(ctx context.Context, userID, imageUrl, identifier string, visibility Visibility) (string, error)
		FindByIdentifier(context.Context, string, string) (*UserImage, error)
	}
	Session interface{
		// GetSessionById(string) (Session, error)
		// GetSessionByToken(string) (Session, error)
		// CreateSession(Session) error
		// DeleteSession(string) error
	}
	VerificationToken interface{
		// GetVerificationTokenByIdentifier(string) (VerificationToken, error)
		// CreateVerificationToken(VerificationToken) error
		// DeleteVerificationToken(string) error
	}
	Account interface{
		// GetAccountById(string) (Account, error)
		// GetAccountByProvider(string, string) (Account, error)
		// CreateAccount(Account) error
		// UpdateAccount(Account) error
		// DeleteAccount(string) error
	}
}

func New(db *sql.DB) Storage {
	return Storage{
		User: 			   &UserRepo{db},
		UserImage: 		   &UserImageRepo{db},
		Session: 		   &SessionRepo{db},
		VerificationToken: &VerificationTokenRepo{db},
		Account: 		   &AccountRepo{db},
	}
}

// for transactions 😀 
func withTx (db *sql.DB, ctx context.Context, f func(tx *sql.Tx) error) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	if err := f(tx); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}