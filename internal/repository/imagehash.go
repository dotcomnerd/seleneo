package repository

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	// "time"
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

	fmt.Printf("imageId: %s\n", imageId)

	if err == sql.ErrNoRows {
		fmt.Printf("good case \n")
		return nil, false, nil
	} else if err != nil {
		fmt.Printf("err1 %v\n", err)
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

	fmt.Printf("ownerId: %s\n", ownerId)
	fmt.Printf("image: %v\n", image)

	if err == sql.ErrNoRows {
		fmt.Printf("good case 2 \n")
		return nil, false, nil
	} else if err != nil {
		fmt.Printf("err2 \n")
		return nil, false, err
	}

	return &image, ownerId == image.UserID, errors.New("image found")
}
