package utils

import (
	"os"
	"regexp"
	"strconv"
	"fmt"
)

// mock Array.includes
func contains(ports []uint64, port uint64) bool {
	for _, value := range ports {
		if value == port {
			return true
		}
	}
	return false
}

// look for an available port the server can safely run on
func GetPort(port *uint64) (uint64, error) {
	println(Info("Scanning for available ports"))
	// check which ports are being used
	win := "netstat -a"
	data, err := Exec(Cmd{
		Win: &win,
		Cmd: "lsof -i",
	})
	if err != nil {
		return 0, err
	}
	// get numerical values for all the ports in use
	str_ports := regexp.MustCompile(`:\d+`).FindAllString(data, -1)
	num_ports := []uint64{}
	for _, str := range str_ports {
		value, err := strconv.ParseUint(str[1:], 10, 64)
		if err != nil {
			return 0, err
		}
		num_ports = append(num_ports, value)
	}
	var ideal_port uint64 = 3000
	// check port from args and env
	if port != nil {
		ideal_port = *port
	} else if env_port := os.Getenv("PORT"); env_port != "" {
		value, err := strconv.ParseUint(env_port, 10, 64)
		if err == nil {
			ideal_port = value
		}
	}
	// increment port
	for contains(num_ports, ideal_port) {
		println(Warn(fmt.Sprintf("Port %d already in use", ideal_port)))
		ideal_port++
	}
	return ideal_port, nil
}
