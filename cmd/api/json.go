package main

import (
	"encoding/json"
	"net/http"
	"github.com/go-playground/validator/v10"
)

var Validate *validator.Validate // good library for validating data

func init() {
	Validate = validator.New(validator.WithRequiredStructEnabled())
}

func writeJSON(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}

func writeJsonError(w http.ResponseWriter, status int, message string) error {
	type json struct {
		Error string `json:"error"`
	}

	return writeJSON(w, status, &json{Error: message})
}

func (app *application) jsonResponse(w http.ResponseWriter, status int, data any) error {
	type json struct {
		Data any `json:"data"`
	}

	return writeJSON(w, status, &json{Data: data})
}