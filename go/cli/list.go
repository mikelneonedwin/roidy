package cli

import (
	"encoding/json"
	"fmt"
	"regexp"
	"roidy/go/utils"
	"strings"
)

type Device struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

// list all available devices connected via adb with their names and ids
func ListDevices() ([]Device, error) {
	// get data from adb
	data_1, err := utils.Execs("adb devices")
	if err != nil {
		return nil, err
	}
	// stringify data
	data_2, err := json.Marshal(data_1)
	if err != nil {
		return nil, err
	}
	// extract ids
	data_3 := strings.TrimSpace(string(data_2))
	pattern := regexp.MustCompile(`[\d.]{5,}(:\d+)?`)
	ids := pattern.FindAllString(data_3, -1)
	// get device data
	devices := []Device{}
	for _, id := range ids {
		cmd := fmt.Sprintf("adb -s %s shell getprop ro.product.model", id)
		name, err := utils.Execs(cmd)
		if err != nil {
			return nil, err
		}
		devices = append(devices, Device{
			Id:   id,
			Name: strings.TrimSpace(string(name)),
		})
	}
	return devices, nil
}
