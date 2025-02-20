package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/dotcomnerd/seleneo/internal/repository"
	"github.com/dotcomnerd/seleneo/internal/repository/cloudflare"
	"github.com/dotcomnerd/seleneo/internal/util"
)

// TODO: put this into a service layer PLEASE
func (app *application) uploadImageHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	maxBytes := 10 * 1024 * 1024
	err := r.ParseMultipartForm(int64(maxBytes))
	if err != nil {
		writeJsonError(w, http.StatusBadRequest, "Unable to parse form data")
		return
	}

	userID := r.FormValue("userId")
	identifier := r.FormValue("identifier")
	visibility := repository.Visibility(r.FormValue("visibility"))
	if userID == "" || identifier == "" || (visibility != repository.VisibilityPrivate && visibility != repository.VisibilityPublic) {
		writeJsonError(w, http.StatusBadRequest, "Missing required fields")
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		writeJsonError(w, http.StatusBadRequest, "file not found")
		return
	}
	defer file.Close()

	fileBuffer, err := io.ReadAll(file)
	if err != nil {
		writeJsonError(w, http.StatusInternalServerError, "error reading file")
		return
	}

	fileType := header.Header.Get("Content-Type")
	fileExt := strings.Split(fileType, "/")[1]
	if !isValidFileType(fileExt) {
		writeJsonError(w, http.StatusBadRequest, "invalid file type. Only PNG and JPG allowed")
		return
	}

	pHash, err := util.CalculateImageHash(fileBuffer)
	if err != nil {
		app.logger.Errorf("error calculating image hash:", err)
		writeJsonError(w, http.StatusInternalServerError, "Server Error")
		return
	}

	dupImg, isOwner, err := app.repo.ImageHash.FindSimilarImage(ctx, pHash, userID)
	if err != nil && err.Error() != "image found" {
		app.logger.Errorf("error finding similar image:", err)
		app.jsonResponse(w, http.StatusInternalServerError, map[string]interface{}{
			"message": "Server Error",
			"type":    "SERVER_ERROR",
		})
		return
	} else if err != nil && err.Error() == "image found" {
		// TODO: Make custom error for this, also make this return this into data instead of wrapping resp in nest json
		app.jsonResponse(w, http.StatusOK, map[string]interface{}{
			"id":				dupImg.ID,
			"cloudflareUrl":   	dupImg.CloudflareURL,
			"identifier":    	identifier,
			"type":       		"DUPLICATE",
			"isOwner":    		isOwner,
		})
		return
	}

	filename := fmt.Sprintf("image-%s.%s", userID, fileExt)
	imageURL, err := cloudflare.UploadImageToCloudflare(ctx, fileBuffer, fileType, filename)
	if err != nil {
		writeJsonError(w, http.StatusInternalServerError, "error uploading image to cloudflare")
		return
	}

	msg, err := app.repo.UserImage.SaveOrUpdateUserImage(ctx, userID, imageURL, identifier, pHash, visibility)
	if err != nil {
		cloudflare.DeleteImageFromCloudflare(imageURL)
		app.logger.Errorf("error saving image:", err)
		writeJsonError(w, http.StatusInternalServerError, "error saving image")
		return
	}

	app.jsonResponse(w, http.StatusOK, map[string]interface{}{
		"message":    msg,
		"type":       "NEW_SAVE",
		"status":     http.StatusOK,
		"visibility": visibility,
	})
}

type FileType string

const (
	FileTypePNG  FileType = "PNG"
	FileTypeJPG  FileType = "JPG"
)

// i like my helpers and this will be used elsewhere (i hope)
func isValidFileType(fileType string) bool {
	switch FileType(strings.ToUpper(fileType)) {
	case FileTypePNG, FileTypeJPG:
		return true
	default:
		return false
	}
}
