package cli

import (
	"fmt"
	"regexp"
	"strconv"
	"roidy/utils"
)

func getStatus(data string) string {
	// match status
	status_pattern := regexp.MustCompile(`status:\s*(\d)`)
	status_temp := status_pattern.FindStringSubmatch(data)
	// decide status
	switch status_temp[1] {
	case "2":
		return "charging"
	case "3":
		return "discharging"
	case "4":
		return "not_charging"
	case "5":
		return "full"
	default:
		return "unknown"
	}
}

func getHealth(data string) string {
	health_pattern := regexp.MustCompile(`health:\s*(\d)`)
	health_temp := health_pattern.FindStringSubmatch(data)
	switch health_temp[1] {
	case "2":
		return "good"
	case "3":
		return "overheat"
	case "4":
		return "dead"
	case "5":
		return "over voltage"
	case "6":
		return "unspecifed failure"
	default:
		return "unknown error"
	}
}

type BatteryInfo struct {
	status      string
	health      string
	temperature float64
	technology  string
	voltage     float64
	level       uint64
}

// fetch battery info of a device
func Battery(id string) (BatteryInfo, error) {
	data, err := utils.Execs(fmt.Sprintf("adb -s %s shell dumpsys battery", id))
	if err != nil {
		// panic(err)
		return BatteryInfo{}, err
	}
	status := getStatus(data)
	health := getHealth(data)
	temp_temp := regexp.MustCompile(`temperature:\s*(\d+)`).FindStringSubmatch(data)[1]
	temp_value, err := strconv.ParseFloat(temp_temp, 64)
	if err != nil {
		// panic(err)
		return BatteryInfo{}, err
	}
	temperature := temp_value / 10
	technology := regexp.MustCompile(`technology:\s*(.+)`).FindStringSubmatch(data)[1]
	volt_temp := regexp.MustCompile(`voltage:\s*(\d+)`).FindStringSubmatch(data)[1]
	volt_value, err := strconv.ParseFloat(volt_temp, 64)
	if err != nil {
		// panic(err)
		return BatteryInfo{}, err
	}
	voltage := volt_value / 1000
	level_temp := regexp.MustCompile(`level:\s*(\d+)`).FindStringSubmatch(data)[1]
	level, err := strconv.ParseUint(level_temp, 10, 8)
	if err != nil {
		// panic(err)
		return BatteryInfo{}, err
	}
	return BatteryInfo{
		status,
		health,
		temperature,
		technology,
		voltage,
		level,
	}, nil
}
