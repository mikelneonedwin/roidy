package cli

import (
	"os"
	"roidy/utils"
	"fmt"
)

func Pull(id string, source string, dest string) error {
	if err := os.MkdirAll(dest, 0755); err != nil {
		return err
	}
	_, err := utils.Execs(fmt.Sprintf(`adb -s %s pull "/sdcard/%s" %q`, id, source, dest))
	return err
}