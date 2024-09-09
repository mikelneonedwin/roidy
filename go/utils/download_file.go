package utils

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

// download data at a url to a particular path on local computer
func DownloadFile(url string, path string) error {
	fmt.Printf("Downloading %s to %s \n", url, path)
	
	out, err := os.Create(path)
	if err != nil {
		return err
	}
	defer out.Close()
	
	resp, err := http.Get(url)
	if err != nil {
		return err
	}
	defer resp.Body.Close()	

	if resp.StatusCode != http.StatusOK {
		return errors.New("Download failed!")
	}

	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return err
	}

	return nil
}