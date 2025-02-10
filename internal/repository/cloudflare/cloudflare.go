package cloudflare

import (
	"bytes"
	"context"
	"fmt"
	"strings"

	"github.com/cloudflare/cloudflare-go/v4"
	"github.com/cloudflare/cloudflare-go/v4/images"
	"github.com/cloudflare/cloudflare-go/v4/option"

	"github.com/dotcomnerd/seleneo/internal/env"
)

func UploadImageToCloudflare(fileBuffer []byte, fileType, userId string) (string, error) {
	accountID := env.GetString("CLOUDFLARE_ACCOUNT_ID", "GET_YOUR_OWN_CLOUDFLARE_ID")
	apiToken := env.GetString("CLOUDFLARE_API_TOKEN", "GET_YOUR_OWN_CLOUDFLARE_API_KEY")

	api := cloudflare.NewClient(
		option.WithAPIToken(apiToken),
	)

	reader := bytes.NewReader(fileBuffer)
	filename := fmt.Sprintf("image-%s.%s", userId, fileType)
	contentType := fmt.Sprintf("image/%s", fileType)
	file := cloudflare.FileParam(reader, filename, contentType)

	//TODO: change from background to a timeout context, based on connection (ctx in handler)
	image, err := api.Images.V1.New(context.Background(), images.V1NewParams{
		AccountID: cloudflare.F(accountID),
		// NAHH THIS CLOUDFLARE API IS SO AWEFUL OML
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

	_, err := api.Images.V1.Delete(context.Background(), imageId, images.V1DeleteParams{
		AccountID: cloudflare.F(accountID),
	}) 

	if err != nil {
		return fmt.Errorf("failed to delete image: %w", err)
	}

	// TODO: find a way to get errors on response
	// I still hate this shitty ahh cloudflare API with my whole SOUL

	return nil
}
