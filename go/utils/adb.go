package utils

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"runtime"
)

func CheckADB() bool {
	win := "where adb"
	_, err := Exec(Cmd{
		Win: &win,
		Cmd: "which adb",
	})
	if err != nil {
		return false
	}
	return true
}

type adb struct {
	DevOptions string `json:"dev-options"`
	Win        string `json:"adb-win32"`
	Mac        string `json:"adb-darwin"`
	Linux      string `json:"adb-linux"`
	Tools      string `json:"platform-tools"`
}

type PackageJson struct {
	adb adb `json:"adb"`
}

func get_adb_url() (string, error) {
	json_path := filepath.Join("..", "..", "package.json")
	file, err := os.Open(json_path)
	if err != nil {
		return "", err
	}
	defer file.Close()
	// read json
	byteValue, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}
	var jason PackageJson
	err = json.Unmarshal(byteValue, &jason)
	if err != nil {
		return "", err
	}

	switch runtime.GOOS {
	case "windows":
		return jason.adb.Win, nil
	case "darwin":
		return jason.adb.Mac, nil
	case "linux":
		return jason.adb.Linux, nil
	default:
		err := fmt.Sprintf("Cannot find adb installation for this device, visit %s to see available options to install adb for your device", jason.adb.Tools)
		return "", errors.New(err)
	}
}

func DownloadADB() error {
	adb_url, err := get_adb_url()
	if err != nil {
		return err
	}
	dl_path := filepath.Join("bin", "adb.zip")
	// download zip file
	if err = DownloadFile(adb_url, dl_path); err != nil {
		return err
	}
	// extract contents
	if Unzip(dl_path, ".") != nil {
		return err
	}
	// delete zip file
	if os.RemoveAll(dl_path) != nil {
		return err
	}
	fmt.Println("ADB installed successfully for use by Roidy")
	return nil
}
