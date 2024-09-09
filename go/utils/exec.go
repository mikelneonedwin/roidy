package utils

import (
	"fmt"
	"os"
	shell "os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"errors"
)

type Cmd struct {
	Win   *string `json:"win,omitempty"`   // Optional Windows command
	Mac   *string `json:"mac,omitempty"`   // Optional macOS command
	Linux *string `json:"linux,omitempty"` // Optional Linux command
	Cmd   string  `json:"cmd"`             // Default fallback command
}

func exec(cmd string) (string, error) {
	cmds := strings.Split(cmd, " ")
	data, err := shell.Command(cmds[0], cmds[1:]...).CombinedOutput()
	if err != nil {
		return "", errors.New(fmt.Sprintf("%s %s", err.Error(), string(data)))
	} else {
		return string(data), nil
	}
}

type History struct {
	error error  `json:"error,omitempty"`
	data  string `json:"data,omitempty"`
}

var history = []History{}

func wrap(cmd string) (string, error) {
	data, err := exec(cmd)
	history = append(history, History{
		error: err,
		data:  data,
	})
	os.WriteFile(
		filepath.Join("..", "..", "log.json"), 
		[]byte(data), 
		0644,
	)
	return data, err
}

func Exec(cmd Cmd) (string, error) {
	var str string

	// windows
	if runtime.GOOS == "windows" && cmd.Win != nil {
		str = *cmd.Win
		// linux
	} else if runtime.GOOS == "linux" && cmd.Linux != nil {
		str = *cmd.Linux
		// darwin
	} else if runtime.GOOS == "darwin" && cmd.Mac != nil {
		str = *cmd.Mac
		// default
	} else {
		str = cmd.Cmd
	}

	// NOTE match this code later
	// switch (process.env.NODE_ENV) {
	//     case "production": return exec(cmd)
	//     default: return wrap(cmd)
	// }

	d, e := wrap(str)
	return d, e
}

func Execs(cmd string) (string, error) {
	d, e := wrap(cmd)
	return d, e
}
