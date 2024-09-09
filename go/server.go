package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"os"
	"roidy/utils"
)

func listen(port string, router *mux.Router) {
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		fmt.Println(utils.Error("Unable to start server: " + err.Error()))
		os.Exit(1)
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

	defer listen(fmt.Sprintf("%v", s_port), router)

	fmt.Println(utils.Info(fmt.Sprintf("Starting server on port %v", s_port)))
	url := fmt.Sprintf("http://localhost:%v", s_port)
	fmt.Printf("Visit %s in your browser \n", url)
	// auto open in browser
	win := fmt.Sprintf("start %s", url)
	mac := fmt.Sprintf("open %s", url)
	utils.Exec(utils.Cmd{
		Win: &win,
		Mac: &mac,
		Cmd: fmt.Sprintf("xdg-open %s", url),
	})
}
