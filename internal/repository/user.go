package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/dotcomnerd/seleneo/internal/repository/cloudflare"
)

type User struct {
	ID            string      `json:"id"`
	Name          *string     `json:"name,omitempty"`
	Email         *string     `json:"email,omitempty"`
	EmailVerified *time.Time  `json:"emailVerified,omitempty"`
	Image         *string     `json:"image,omitempty"`
}

type UserRepo struct {
	db *sql.DB
}

func (u *UserRepo) GetUserById(ctx context.Context, id string) (*User, error) {
	query := `
		SELECT id, name, email, "emailVerified", image
		FROM "User"
		WHERE "id" = $1
	`

	ctx, cancel := context.WithTimeout(ctx, DeleteQueryTimeout)
	defer cancel()

	user := &User{}
	err := u.db.QueryRowContext(ctx, query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.EmailVerified,
		&user.Image,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("user with ID %s not found", id)
	} else if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserRepo) DeleteUser(ctx context.Context, id string) error {
	return withTx(u.db, ctx, func(tx *sql.Tx) error {
		query := `SELECT "cloudflareUrl" FROM "UserImage" WHERE "userId" = $1`
		rows, err := tx.QueryContext(ctx, query, id)
		if err != nil {
			return err
		}
		defer rows.Close()

		var cloudflareURLs []string
		for rows.Next() {
			var imageURL string
			if err := rows.Scan(&imageURL); err != nil {
				return err
			}
			cloudflareURLs = append(cloudflareURLs, imageURL)
		}

		for _, imageURL := range cloudflareURLs {
			if err := cloudflare.DeleteImageFromCloudflare(imageURL); err != nil {
				return err
			}
		}

		_, err = tx.ExecContext(ctx, `DELETE FROM "UserImage" WHERE "userId" = $1`, id)
		if err != nil {
			return err
		}

		// potential delete, might be handled by next-auth
		_, err = tx.ExecContext(ctx, `DELETE FROM "Session" WHERE "userId" = $1`, id)
		if err != nil {
			return err
		}

		_, err = tx.ExecContext(ctx, `DELETE FROM "User" WHERE id = $1`, id)
		if err != nil {
			return err
		}

		return nil
	})
}
