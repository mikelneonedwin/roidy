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

func checkAdb() error {
	println(Info("Checking ADB availability"))
	win := "where adb"
	_, err := Exec(Cmd{
		Win: &win,
		Cmd: "which adb",
	})
	if err == nil {
		println(Info("ADB available ✔"))
		return nil
	}
	// download adb
	println(Warn("ADB not found!"))
	return downloadAdb()
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
	file, err := os.Open("package.json")
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

func downloadAdb() error {
	adb_url, err := get_adb_url()
	if err != nil {
		return err
	}
	dl_path := filepath.Join("bin", "adb.zip")
	println(Info("Attempting local ADB installation"))
	// download zip file
	if err = DownloadFile(adb_url, dl_path); err != nil {
		// delete zip file
		os.Remove(dl_path)
		return err
	}
	if err = Unzip(dl_path, "."); err != nil {
		// delete zip file
		os.Remove(dl_path)
		return err
	}
	// delete zip file
	os.RemoveAll(dl_path)
	println(Info("ADB installed successfully ✔"))
	return nil
}

type Config struct {
	Adb bool `json:"adb,omitempty"`
}

func checker() {

}

func VetAdb() error {
	config_file, err := os.ReadFile("config.json")
	// config.json exist, run check
	if err == nil {
		// parse json and check adb
		var config Config
		json.Unmarshal(config_file, &config)
		if !config.Adb {
			// run check
			if err := checkAdb(); err != nil {
				return err
			} else {
				// add adb to config
				config.Adb = true
				final_bytes, _ := json.Marshal(config)
				os.WriteFile("config.json", final_bytes, 0644)
				return nil
			}
		}
		// adb was previously located
		return nil
	// config.json does not exist, run check then create it
	} else {
		if err := checkAdb(); err != nil {
			return err
		} else {
			config_bytes, _ := json.Marshal(Config{
				Adb: true,
			})
			os.WriteFile("config.json", config_bytes, 0644)
			return nil
		}
	}
}
