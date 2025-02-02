package cloudflare

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	"github.com/dotcomnerd/seleneo/internal/env"
	// "os"
)

type CloudflareResponse struct {
	Result struct {
		Variants []string `json:"variants"`
	} `json:"result"`
}

// extra shit fast shipping code code
// TODO: REWRITE
func UploadImageToCloudflare(fileBuffer []byte, fileType, userId string) (string, error) {
	accountID := env.GetString("CLOUDFLARE_ACCOUNT_ID", "GET_YOUR_OWN_CLOUDFLARE_ID")
	apiToken := env.GetString("CLOUDFLARE_API_TOKEN", "GET_YOUR_OWN_CLOUDFLARE_API_KEY")

	url := fmt.Sprintf("https://api.cloudflare.com/client/v4/accounts/%s/images/v1", accountID)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	fileWriter, _ := writer.CreateFormFile("file", fmt.Sprintf("image-%s.%s", userId, fileType))
	fileWriter.Write(fileBuffer)
	writer.WriteField("requireSignedURLs", "false")
	writer.Close()

	req, _ := http.NewRequest("POST", url, body)
	bearer := fmt.Sprintf("Bearer %s", apiToken)
	req.Header.Set("Authorization", bearer)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return "", errors.New("failed to upload image")
	}
	defer resp.Body.Close()

	var response CloudflareResponse
	json.NewDecoder(resp.Body).Decode(&response)

	return response.Result.Variants[0], nil
}

func DeleteImageFromCloudflare(imageURL string) error {
	accountID := env.GetString("CLOUDFLARE_ACCOUNT_ID", "GET_YOUR_OWN_CLOUDFLARE_ID")
	apiToken := env.GetString("CLOUDFLARE_API_TOKEN", "GET_YOUR_OWN_CLOUDFLARE_API_KEY")

	parts := strings.Split(imageURL, "/")
	if len(parts) < 5 {
		return errors.New("invalid Cloudflare URL format")
	}
	imageID := parts[4]
	fmt.Println(imageID)

	url := fmt.Sprintf("https://api.cloudflare.com/client/v4/accounts/%s/images/v1/%s", accountID, imageID)

	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return err
	}
	bearer := fmt.Sprintf("Bearer %s", apiToken)
	req.Header.Set("Authorization", bearer)

	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to delete image from Cloudflare, status: %d", resp.StatusCode)
	}
	defer resp.Body.Close()

	return nil
}
