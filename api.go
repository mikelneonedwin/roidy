package main

import (
	"embed"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"roidy/go/cli"
	"roidy/go/utils"
	"time"

	"github.com/gorilla/mux"
)

//go:embed dist/*
var assets embed.FS

// handle all functions that might have errors
func handle(callback func() (any, error)) func(w http.ResponseWriter, r *http.Request) {
	data, err := callback()
	if err == nil {
		return func(w http.ResponseWriter, r *http.Request) {
			json.NewEncoder(w).Encode(data)
		}
	} else {
		return func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println(utils.Error(err.Error()))
			fmt.Fprintln(w, err.Error())
		}
	}
}

// handle functions that might have errors from within their handler
func handleInner(w http.ResponseWriter, callback func() (any, error)) {
	data, err := callback()
	if err == nil {
		json.NewEncoder(w).Encode(data)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Println(utils.Error(err.Error()))
		fmt.Fprintln(w, err.Error())
	}
}

// start server
func Server(port *uint64) {
	router := Api()
	s_port, err := utils.GetPort(port)
	if err != nil {
		fmt.Println(utils.Error("Unable to start server: " + err.Error()))
		os.Exit(1)
	}

	url := fmt.Sprintf("http://localhost:%v", s_port)
	fmt.Println(utils.Info(fmt.Sprintf("Server running on port %v \n\tVisit %s in your browser", s_port, url)))

	go func() {
		// run as routine to start server as fast as possible
		// auto open in browser
		win := fmt.Sprintf("start %s", url)
		mac := fmt.Sprintf("open %s", url)
		utils.Exec(utils.Cmd{
			Win: &win,
			Mac: &mac,
			Cmd: fmt.Sprintf("xdg-open %s", url),
		})
	}()

	if err = http.ListenAndServe(fmt.Sprintf(":%v", s_port), router); err != nil {
		fmt.Println(utils.Error("Unable to start server: " + err.Error()))
		os.Exit(1)
	}
}

// register endpoints to router
func Api() *mux.Router {
	router := mux.NewRouter()
	// list connected devices
	router.HandleFunc("/api/devices", handle(func() (any, error) {
		return cli.ListDevices()
	})).Methods("GET")
	// trigger connection via usb
	router.HandleFunc("/api/connect/usb", handle(func() (any, error) {
		return cli.ConnectUsb()
	})).Methods("GET")
	// connect to ips detected on network
	router.HandleFunc("/api/connect/gateway", handle(func() (any, error) {
		return cli.ConnectGateway()
	})).Methods("GET")
	// get a list of available ips on network
	router.HandleFunc("/api/local_ips", handle(func() (any, error) {
		win := "ipconfig"
		data, err := utils.Exec(utils.Cmd{
			Win: &win,
			Cmd: "ifconfig",
		})
		if err != nil {
			return nil, err
		}
		ips := regexp.MustCompile(`\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`).FindAllString(data, -1)
		return ips, nil
	})).Methods("GET")
	// connect to an ip
	router.HandleFunc("/api/connect/ip/{ip}", func(w http.ResponseWriter, r *http.Request) {
		ip := mux.Vars(r)["ip"]
		handleInner(w, func() (any, error) {
			return cli.ConnectIp(ip)
		})
	}).Methods("GET")
	// get info on internal storage
	router.HandleFunc("/api/{id}/storage", func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		handleInner(w, func() (any, error) {
			return cli.Storage(id)
		})
	}).Methods("GET")
	// get info for battery
	router.HandleFunc("/api/{id}/battery", func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		handleInner(w, func() (any, error) {
			return cli.Battery(id)
		})
	}).Methods("GET")
	// read directories on android
	router.HandleFunc("/api/{id}/files/{path:.*}", func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		path := mux.Vars(r)["path"]
		handleInner(w, func() (any, error) {
			return cli.Readdir(id, path)
		})
	}).Methods("GET")
	// fetch a file from android and serve it to browser
	router.HandleFunc("/api/:id/download/{source:.*}", func(w http.ResponseWriter, r *http.Request) {
		id := mux.Vars(r)["id"]
		source := mux.Vars(r)["source"]
		dest := filepath.Join(
			os.TempDir(),
			string(time.Now().UnixNano()),
			filepath.Base(source),
		)
		// pull to pc
		err := cli.Pull(id, source, dest)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Println(utils.Error(err.Error()))
			fmt.Fprintln(w, err.Error())
			return
		}
		// serve to browser
		file, err := os.Open(dest)
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		defer file.Close()

		// Set headers to indicate a file download
		w.Header().Set("Content-Disposition", "attachment; filename="+filepath.Base(dest))
		w.Header().Set("Content-Type", "application/octet-stream")

		info, err := file.Stat()
		if err != nil {
			http.Error(w, "Can't access file", http.StatusInternalServerError)
			return
		}
		// Copy the file contents to the response writer
		http.ServeContent(w, r, dest, info.ModTime(), file)
	}).Methods("GET")

	// add static files
	router.HandleFunc("/{path:.*}", func(w http.ResponseWriter, r *http.Request) {
		path := mux.Vars(r)["path"]
		// Serve files from the embedded file system
		file, err := assets.ReadFile("dist/" + path)
		println("PATH:"+path)
		if err != nil {
			// serve index.html if file does not exist
			file, _ = assets.ReadFile("dist/index.html")
			println("Serving index.html")
		} else {
			println("Serving actual file")
		}
		// Set the Content-Type header
		w.Header().Set("Content-Type", http.DetectContentType(file))
		// Write the byte slice to the ResponseWriter
		w.Write(file)
	})

	return router
}
