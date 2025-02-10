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
		SaveOrUpdateUserImage(context.Context, string, string, string, string, Visibility) (string, error)
		FindByIdentifier(context.Context, string, string) (*UserImage, error)
	}
	ImageHash interface {
		FindSimilarImage(context.Context, string, string) (*UserImage, bool, error)
	}

}

// TODO: rewrite with gorm instead of sql.DB
func New(db *sql.DB) Storage {
	return Storage{
		User: 			   &UserRepo{db},
		UserImage: 		   &UserImageRepo{db},
		ImageHash: 		   &ImageHashRepo{db},
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