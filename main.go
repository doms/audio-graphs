package main

import (
	"context"
	"encoding/json"
	"html/template"
	"log"
	"net/http"
	"os"

	"github.com/zmb3/spotify"
	"golang.org/x/oauth2/clientcredentials"
)

var (
	client    spotify.Client
	templates = template.Must(template.ParseGlob("templates/*"))
)

func init() {
	config := &clientcredentials.Config{
		ClientID:     os.Getenv("SPOTIFY_ID"),
		ClientSecret: os.Getenv("SPOTIFY_SECRET"),
		TokenURL:     spotify.TokenURL,
	}
	token, err := config.Token(context.Background())
	if err != nil {
		log.Fatalf("couldn't get token: %v", err)
	}

	client = spotify.Authenticator{}.NewClient(token)
}

func featuresHandler(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query()["id"][0]

	results, err := client.GetAudioFeatures(spotify.ID(id))
	if err != nil {
		log.Fatal(err)
	}

	if len(results) > 0 {
		featuresJSON, err := json.Marshal(results)
		if err != nil {
			log.Fatal("oops, features broke xD")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		returnJSON(featuresJSON, w, r)
	}
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	searchTerm := r.URL.Query()["query"][0]

	results, err := client.Search(searchTerm, spotify.SearchTypeTrack)
	if err != nil {
		log.Fatal(err)
	}

	if results.Tracks != nil {
		trackJSON, err := json.Marshal(results.Tracks.Tracks)
		if err != nil {
			log.Fatal("oops, search broke xD")
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		returnJSON(trackJSON, w, r)
	}
}

func returnJSON(data []byte, w http.ResponseWriter, r *http.Request) {
	// data format
	w.Header().Set("Content-Type", "application/json")

	// CORS to allow all callers
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// write JSON response
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	var data interface{}
	renderTemplate(w, "index", data)
}

func renderTemplate(w http.ResponseWriter, tmpl string, data interface{}) {
	// write content type to head
	w.Header().Set("Content-Type", "text/html; charset=utf-8")

	// render layout
	err := templates.ExecuteTemplate(w, tmpl+".html", data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	// serve stuff from static
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))

	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/search", searchHandler)
	http.HandleFunc("/features", featuresHandler)

	// listen on port
	log.Fatal(http.ListenAndServe(getPort(), nil))
}

func getPort() string {
	p := os.Getenv("PORT")
	if p != "" {
		return ":" + p
	}
	return ":8080"
}
