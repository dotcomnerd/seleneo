package main

import (
	"io"
	"net/http"
	"strings"

	"github.com/dotcomnerd/seleneo/internal/repository"
	"github.com/dotcomnerd/seleneo/internal/repository/cloudflare"
)

func (app *application) uploadImageHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	maxBytes := 6 * 1024 * 1024
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
	// TODO: FIND A WAY TO MAKE IT FASTER
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

	imageURL, err := cloudflare.UploadImageToCloudflare(fileBuffer, fileExt, userID)
	if err != nil {
		writeJsonError(w, http.StatusInternalServerError, "error uploading image to cloudflare")
		return
	}

	msg, err := app.repo.UserImage.SaveOrUpdateUserImage(ctx, userID, imageURL, identifier, visibility)
	if err != nil {
		writeJsonError(w, http.StatusInternalServerError, "error saving image")
		return
	}

	app.jsonResponse(w, http.StatusOK, map[string]interface{}{
		"message":    msg,
		"type":       "NEW_SAVE",
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
