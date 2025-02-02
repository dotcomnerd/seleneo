package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type Visibility string

const (
	VisibilityPublic  Visibility = "PUBLIC"
	VisibilityPrivate Visibility = "PRIVATE"
)

type UserImage struct {
	ID            string     `json:"id"`
	Identifier    string     `json:"identifier"`
	UserID        string     `json:"userId"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	CloudflareURL string     `json:"cloudflareUrl"`
	Visibility    Visibility `json:"visibility"`

	User *User `json:"user,omitempty"`
}

type UserImageRepo struct {
	db *sql.DB
}

func (ui *UserImageRepo) SaveOrUpdateUserImage(ctx context.Context, userID, imageUrl, identifier string, visibility Visibility) (string, error) {
	existingImage, _ := ui.FindByIdentifier(ctx, userID, identifier)

	if existingImage != nil {
		_, err := ui.db.ExecContext(ctx, `
			UPDATE "UserImage" SET "cloudflareUrl" = $1, "updatedAt" = $2, visibility = $3 WHERE id = $4`,
			imageUrl, time.Now(), visibility, existingImage.ID)
		if err != nil {
			fmt.Println("error updating image 41")
			return "", err
		}
		return "Image updated successfully", nil
	}

	// create UUID here cause negitive DB perf if we make the DB do it
	id := uuid.New().String()
	_, err := ui.db.ExecContext(ctx, `
		INSERT INTO "UserImage" (id, "userId", "cloudflareUrl", identifier, "createdAt", "updatedAt", visibility)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		id, userID, imageUrl, identifier, time.Now(), time.Now(), visibility)

	if err != nil {
		fmt.Println("error saving image 56")
		return "", err
	}

	return "Image saved successfully", nil
}

func (ui *UserImageRepo) FindByIdentifier(ctx context.Context, userId, identifier string) (*UserImage, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	var image UserImage
	err := ui.db.QueryRowContext(ctx, `
		SELECT id, "userId", "cloudflareUrl", identifier, "createdAt", "updatedAt", visibility 
		FROM "UserImage" WHERE "userId" = $1 AND identifier = $2`, userId, identifier).
		Scan(&image.ID, &image.UserID, &image.CloudflareURL, &image.Identifier, &image.CreatedAt, &image.UpdatedAt, &image.Visibility)

	if err == sql.ErrNoRows {
		fmt.Println("No image found")
		return nil, nil
	}

	if err != nil {
		fmt.Println("Error finding image")
		return nil, err
	}

	return &image, nil
}