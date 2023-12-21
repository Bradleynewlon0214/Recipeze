package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type Storage interface {
	CreateAccount(*Account) error
	DeleteAccount(int) error
	UpdateAccount(*Account) error
	GetAccountByID(int) (*Account, error)
	GetAccountByNumber(int64) (*Account, error)
	GetAccounts() ([]*Account, error)
}

type PostgressStore struct {
	db *sql.DB
}

func NewPostgressStore() (*PostgressStore, error) {
	connStr := "user=postgres dbname=postgres password=gopostgres sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &PostgressStore{
		db: db,
	}, nil
}

func (s *PostgressStore) Init() error {
	return s.createAccountTable()
}

func (s *PostgressStore) createAccountTable() error {

	query := `create table if not exists account (
		id serial primary key,
		firstName varchar(50),
		lastName varchar(50),
		number serial,
		encryptedPassword varchar,
		balance numeric,
		createdAt timestamp
	)`

	_, err := s.db.Exec(query)

	return err
}

func (s *PostgressStore) CreateAccount(acc *Account) error {
	query := `
		insert into account 
		(firstName, lastName, number, encryptedPassword, balance, createdAt) 
		values 
		($1, $2, $3, $4, $5, $6)`
	resp, err := s.db.Query(query, acc.FirstName, acc.LastName, acc.Number, acc.EncryptedPassword, acc.Balance, acc.CreatedAt)

	if err != nil {
		return err
	}

	fmt.Printf("%+v\n", resp)

	return nil
}
func (s *PostgressStore) DeleteAccount(id int) error {
	_, err := s.db.Query("DELETE FROM account WHERE id = $1", id)
	return err
}
func (s *PostgressStore) UpdateAccount(*Account) error {
	return nil
}

func (s *PostgressStore) GetAccountByNumber(number int64) (*Account, error) {
	rows, err := s.db.Query("SELECT * FROM account WHERE number = $1", number)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		return scanIntoAccount(rows)
	}
	return nil, fmt.Errorf("Account %d not found", number)
}

func (s *PostgressStore) GetAccountByID(id int) (*Account, error) {
	rows, err := s.db.Query("SELECT * FROM account WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	for rows.Next() {
		return scanIntoAccount(rows)
	}
	return nil, fmt.Errorf("Account %d not found", id)
}

func (s *PostgressStore) GetAccounts() ([]*Account, error) {
	query := `SELECT * FROM account`
	rows, err := s.db.Query(query)
	if err != nil {
		return nil, err
	}

	accounts := []*Account{}
	for rows.Next() {
		account, err := scanIntoAccount(rows)
		if err != nil {
			return nil, err
		}
		accounts = append(accounts, account)
	}

	return accounts, nil
}

func scanIntoAccount(rows *sql.Rows) (*Account, error) {
	account := new(Account)
	err := rows.Scan(
		&account.ID,
		&account.FirstName,
		&account.LastName,
		&account.Number,
		&account.EncryptedPassword,
		&account.Balance,
		&account.CreatedAt)

	return account, err
}
