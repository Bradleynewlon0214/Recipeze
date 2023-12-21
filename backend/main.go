package main

import (
	"log"
)

func seedAccount(store Storage, fname, lname, pw string) *Account {
	acc, err := NewAccount(fname, lname, pw)
	if err != nil {
		log.Fatal(err)
	}

	if err := store.CreateAccount(acc); err != nil {
		log.Fatal(err)
	}

	return acc
}

func seedAccounts(s Storage) {
	seedAccount(s, "Bradley", "Newlon", "pass")
}

func main() {

	// seed := flag.Bool("seed", false, "seed the db?")
	// flag.Parse()

	store, err := NewPostgressStore()
	if err != nil {
		log.Fatal(err)
	}

	if err := store.Init(); err != nil {
		log.Fatal(err)
	}

	// if *seed {
	// seedAccounts(store)
	// }

	server := NewAPIServer(":3000", store)
	server.Run()
}
