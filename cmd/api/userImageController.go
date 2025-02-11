package main

import (
	"io"
	"net/http"
	"strings"

	"github.com/dotcomnerd/seleneo/internal/repository"
	"github.com/dotcomnerd/seleneo/internal/repository/cloudflare"
	"github.com/dotcomnerd/seleneo/internal/util"
)

// TODO: add better logs for this function
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

	// this will be slow
	// TODO: FIND A WAY TO MAKE IT FASTER (one might not exist :void:)
	file, _, err := r.FormFile("file")
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

	fileType := http.DetectContentType(fileBuffer)
	fileExt := strings.Split(fileType, "/")[1]
	if !isValidFileType(fileExt) {
		writeJsonError(w, http.StatusBadRequest, "invalid file type. Only PNG, JPG, WEBP, and SVG allowed")
		return
	}

	pHash, err := util.CalculateImageHash(fileBuffer)
	if err != nil {
		writeJsonError(w, http.StatusInternalServerError, "error processing image")
		return
	}

	dupImg, isOwner, err := app.repo.ImageHash.FindSimilarImage(ctx, pHash, userID)
	if err != nil && err.Error() != "image found" {
		app.jsonResponse(w, http.StatusInternalServerError, "Server error")
		return
	} else if err != nil && err.Error() == "image found" {
		// TODO: Make custom error for this, also make this return this into data instead of wrapping resp in nest json
		app.jsonResponse(w, http.StatusOK, map[string]interface{}{
			"id":				dupImg.ID,
			"cloudflareUrl":   	dupImg.CloudflareURL,
			"identifier":    	identifier,
			"message":    		"Design already exists",
			"type":       		"DUPLICATE",
			"isOwner":    		isOwner,
			"status":    		http.StatusNoContent,
		})
		return
	}

	imageURL, err := cloudflare.UploadImageToCloudflare(ctx, fileBuffer, fileExt, userID)
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
	FileTypeWEBP FileType = "WEBP"
	FileTypeSVG  FileType = "SVG"
)

// i like my helpers and this will be used elsewhere (i hope)
func isValidFileType(fileType string) bool {
	switch FileType(strings.ToUpper(fileType)) {
	case FileTypePNG, FileTypeJPG, FileTypeWEBP, FileTypeSVG:
		return true
	default:
		return false
	}
}
