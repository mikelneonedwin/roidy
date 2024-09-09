package main

import (
	"os"
	"path/filepath"
	"runtime"
)

func main() {
	{
		// update path
		originalPath := os.Getenv("PATH")
		newPath, err := filepath.Abs("platform-tools")
		if err != nil {
			panic(err)
		}
		var delimiter string
		if runtime.GOOS == "windows" {
			delimiter = ";"
		} else {
			delimiter = ":"
		}
		updatedPath := newPath + delimiter + originalPath
		os.Setenv("PATH", updatedPath)
	}

	Server(nil)
}
