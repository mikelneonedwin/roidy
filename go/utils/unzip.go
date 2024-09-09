package utils

import (
	"archive/zip"
	"io"
	"os"
	"path/filepath"
)

func Unzip(src string, dest string) error {
	reader, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer reader.Close()
	os.MkdirAll(dest, 0755)
	// iterate over files in zip archive
	for _, file := range reader.File {
		// get path info
		fpath := filepath.Join(dest, file.Name)
		// create directory if directory
		if file.FileInfo().IsDir() {
			err := os.MkdirAll(fpath, file.Mode())
			if err != nil {
				return err
			}
			continue
		}

		// ensure parent directory exists
		if err = os.MkdirAll(filepath.Dir(fpath), file.Mode()); err != nil {
			return err
		}

		// open file inside achive
		filex, err := file.Open()
		if err != nil {
			return err
		}
		defer filex.Close()

		// create thee destination file
		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode())
		if err != nil {
			return err
		}
		defer outFile.Close()

		// copy contents of file
		_, err = io.Copy(outFile, filex)
		if err != nil {
			return err
		}
	}
	return nil
}
