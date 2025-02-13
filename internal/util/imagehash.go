package util

import (
	"bytes"
	"image"
	_ "image/jpeg"
	_ "image/png"

	"github.com/corona10/goimagehash"
)

func CalculateImageHash(fileBuffer []byte) (string, error) {
	img, _, err := image.Decode(bytes.NewReader(fileBuffer))
	if err != nil {
		return "", err
	}

	hash, err := goimagehash.AverageHash(img)
	if err != nil {
		return "", err
	}

	return hash.ToString(), nil
}