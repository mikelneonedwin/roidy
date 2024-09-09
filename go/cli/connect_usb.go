package cli

import "roidy/utils"

// setup up a connected android device for wireless connection
func ConnectUsb() ([]Device, error) {
	_, err := utils.Execs("adb tcpip 5555")
	if err != nil {
		return nil, err
	}
	devices, err := ListDevices()
	return devices, err
}
