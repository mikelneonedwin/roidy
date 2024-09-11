package cli

import (
	"fmt"
	"regexp"
	"roidy/go/utils"
)

// scan the local network and try connecting to all gateways, assuming one is an available android devices
func ConnectGateway() ([]Device, error) {
	win := "ipconfig"
	data, err := utils.Exec(utils.Cmd{
		Win: &win,
		Cmd: "ifconfig",
	})
	if err != nil {
		return nil, err
	}
	// get ip address
	ipAddrs := regexp.MustCompile(`\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`).FindAllString(data, -1)
	for _, ip := range ipAddrs {
		utils.Execs(fmt.Sprintf("adb connect %s", ip))
	}
	devices, err := ListDevices()
	return devices, err
}
