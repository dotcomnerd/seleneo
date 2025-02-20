package cloudflare

import (
	"bytes"
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/cloudflare/cloudflare-go/v4"
	"github.com/cloudflare/cloudflare-go/v4/images"
	"github.com/cloudflare/cloudflare-go/v4/option"

	"github.com/dotcomnerd/seleneo/internal/env"
)

func UploadImageToCloudflare(ctx context.Context, fileBuffer []byte, fileType, filename string) (string, error) {
	accountID := env.GetString("CLOUDFLARE_ACCOUNT_ID", "GET_YOUR_OWN_CLOUDFLARE_ID")
	apiToken := env.GetString("CLOUDFLARE_API_TOKEN", "GET_YOUR_OWN_CLOUDFLARE_API_KEY")

	api := cloudflare.NewClient(
		option.WithAPIToken(apiToken),
	)

	reader := bytes.NewReader(fileBuffer)
	file := cloudflare.FileParam(reader, filename, fileType)

	image, err := api.Images.V1.New(ctx, images.V1NewParams{
		AccountID: cloudflare.F(accountID),
		File:      cloudflare.F[any](file),
	})

	if err != nil {
		return "", fmt.Errorf("failed to upload image: %w", err)
	}

	return image.Variants[0], nil
}

func DeleteImageFromCloudflare(imageURL string) error {
	accountID := env.GetString("CLOUDFLARE_ACCOUNT_ID", "GET_YOUR_OWN_CLOUDFLARE_ID")
	apiToken := env.GetString("CLOUDFLARE_API_TOKEN", "GET_YOUR_OWN_CLOUDFLARE_API_KEY")

	api := cloudflare.NewClient(
		option.WithAPIToken(apiToken),
	)

	imageId := strings.Split(imageURL, "/")[4]

	// cloudflare timeout is 15 seconds anyway, but this is just a nice precausion
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	_, err := api.Images.V1.Delete(ctx, imageId, images.V1DeleteParams{
		AccountID: cloudflare.F(accountID),
	}) 

	if err != nil {
		return fmt.Errorf("failed to delete image: %w", err)
	}

	// TODO: find a way to get errors on response
	// I still hate this shitty ahh cloudflare API with my whole SOUL

	return nil
}
