package utils

import (
	"fmt"
	"github.com/fatih/color"
)

func Error(err string) string {
	return fmt.Sprintf("%v %s", color.RedString("[ERR]"), err)
}

func Warn(msg string) string {
	return fmt.Sprintf("%v %s", color.YellowString("[WARN]"), msg)
}

func Info(msg string) string {
	return fmt.Sprintf("%v %s", color.CyanString("[INFO]"), msg)
}