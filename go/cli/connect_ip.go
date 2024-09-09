package cli

import (
	"fmt"
	"roidy/utils"
)

func ConnectIp(ip string) ([]Device, error) {
	_, err := utils.Execs(fmt.Sprintf("adb connect %s", ip))
	if err != nil {
		return nil, err
	}
	devices, err := ListDevices()
	return devices, err
}
