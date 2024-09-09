package cli

import (
	"fmt"
	"regexp"
	"strings"
	"roidy/utils"
)

type StorageData struct {
	Size  string // total size in bytes
	Used  string // used space in bytes
	Avail string // available space in bytes
	Usage string // percentage of space used
}

// Get information concerning the user's storage device
func Storage(id string) (StorageData, error) {
	data, err := utils.Execs(fmt.Sprintf("adb -s %s shell df /data -h", id))
	if err != nil {
		return StorageData{}, err
	}
	parts := regexp.MustCompile(`d+(G|M|K)?%?\s`).FindAllString(data, -1)
	return StorageData{
		Size:  strings.TrimSpace(parts[0]) + "B",
		Used:  strings.TrimSpace(parts[1]) + "B",
		Avail: strings.TrimSpace(parts[2]) + "B",
		Usage: strings.TrimSpace(parts[3]),
	}, nil
}
