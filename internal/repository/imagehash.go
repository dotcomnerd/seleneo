package repository

import (
	"context"
	"database/sql"
	"errors"
)

type ImageHash struct {
	ID             string `json:"id"`
	ImageID        string `json:"imageId"`
	PerceptualHash string `json:"perceptualHash"`
}

type ImageHashRepo struct {
	db *sql.DB
}

// use transactions for this?
func (ih *ImageHashRepo) FindSimilarImage(ctx context.Context, pHash, currUserId string) (*UserImage, bool, error) {
	var imageId string
	var ownerId string

	err := ih.db.QueryRowContext(ctx, `SELECT "imageId" FROM "ImageHash" WHERE "perceptualHash" = $1`, pHash).
		Scan(&imageId)

	if err == sql.ErrNoRows {
		return nil, false, nil
	} else if err != nil {
		return nil, false, err
	}

	// im usually against calling someone elses table from another repository but i will fix this later
	// TODO: add this logic to the UserImageRepo, not here. and return just the imageId
	var image UserImage
	err = ih.db.QueryRowContext(ctx, `
		SELECT id, "userId", "cloudflareUrl", identifier, "createdAt", "updatedAt", visibility
		FROM "UserImage"
		WHERE id = $1`, imageId).
		Scan(&image.ID, &ownerId, &image.CloudflareURL, &image.Identifier, &image.CreatedAt, &image.UpdatedAt, &image.Visibility)

	if err == sql.ErrNoRows {
		return nil, false, nil
	} else if err != nil {
		return nil, false, err
	}

	return &image, ownerId == image.UserID, errors.New("image found")
}
