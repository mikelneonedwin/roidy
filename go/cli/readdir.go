package cli

import (
	"errors"
	"fmt"
	"regexp"
	"roidy/go/utils"
	"strings"
)

type File struct {
	Type string
	Name string
	Path string
	Ext  *string
}

func Readdir(id string, path string) ([]File, error) {
	data, err := utils.Execs(fmt.Sprintf("adb -s %s shell ls -l '/sdcard/%s'", id, path))
	if err != nil {
		return nil, err
	}
	if strings.TrimSpace(data) == "" {
		return nil, nil
	}
	if strings.HasPrefix(data, path) {
		return nil, errors.New("No such file or directory")
	}
	data = regexp.MustCompile(`\r`).ReplaceAllString(data, "\n")
	// extract items
	items := regexp.MustCompile(`\n+`).Split(data, -1)
	// convert to presentable format
	files := []File{}
	for _, item := range items {
		var Type string
		switch string(item[0]) {
		case "_":
			Type = "file"
		case "d":
			Type = "dir"
		default:
			Type = "unknown"
		}

		Name := regexp.MustCompile(`:\d+\s+(.+)$`).FindStringSubmatch(item)[1]
		Path := fmt.Sprintf("%s/%s", path, Name)
		// extract first forward slash from path
		Path = strings.Replace(Path, "/", "", 1)

		if Type != "file" {
			files = append(files, File{
				Name: Name,
				Path: Path,
				Type: Type,
			})
		} else {
			parts := strings.Split(Name, ".")
			Ext := parts[len(parts)-1]
			files = append(files, File{
				Name: Name,
				Path: Path,
				Type: Type,
				Ext:  &Ext,
			})
		}
	}
	return files, nil
}
