package main

import (
	"net/http"
	"github.com/go-chi/chi/v5"

)

func (app *application) getUser(w http.ResponseWriter, r *http.Request) {
	userId := chi.URLParam(r, "userId")

	user, err := app.repo.User.GetUserById(r.Context(), userId)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	if user == nil {
		app.notFoundResponse(w, r, err)
		return
	}

	app.jsonResponse(w, http.StatusOK, user)
}

func (app *application) deleteUserHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	userID := chi.URLParam(r, "userId")
	if userID == "" {
		writeJsonError(w, http.StatusBadRequest, "User ID is required")
		return
	}

	authUserID := r.Header.Get("X-Authenticated-User-ID")
	if authUserID == "" || authUserID != userID {
		writeJsonError(w, http.StatusForbidden, "Unauthorized: Invalid userId")
		return
	}

	err := app.repo.User.DeleteUser(ctx, userID)
	if err != nil {
		app.internalServerError(w, r, err)
		return
	}

	app.jsonResponse(w, http.StatusOK, map[string]string{"message": "Account successfully deleted"})
}
