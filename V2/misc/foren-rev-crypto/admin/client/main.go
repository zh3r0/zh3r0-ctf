package main

import (
  "bytes"
  "crypto/aes"
  "crypto/cipher"
  "crypto/rand"
  "crypto/sha256"
  "encoding/base64"
  "encoding/json"
  "fmt"
  "io/ioutil"
  "log"
  "math/big"
  "net/http"
  "os"
)

var (
  P *big.Int
  G *big.Int
)

type Key struct {
  Pub     string  `json:"pub"`
  Private big.Int `json:"-"`
}

func getRandomNumber() (*big.Int, error) {
  var b [64]byte
  if _, err := rand.Read(b[:]); err != nil {
    return nil, err
  }
  return new(big.Int).SetBytes(b[:]), nil
}

func generateClientKey() *Key {
  b, err := getRandomNumber()
  if err != nil {
    return nil
  }
  A := new(big.Int).Exp(G, b, P)
  return &Key{
    Pub:     A.String(),
    Private: *b,
  }
}

const ENDPOINT string = "http://127.0.0.1:8080"

func checkErr(err error) {
  if err != nil {
    log.Fatal(err)
  }
}

func pkcs5Pad(src []byte, blockSize int) []byte {
  paddingLen := blockSize - (len(src) % blockSize)
  padding := bytes.Repeat([]byte{byte(paddingLen)}, paddingLen)
  return append(src, padding...)
}

func encryptFile(file string, key []byte, iv []byte) []byte {
  plainText, err := ioutil.ReadFile(file)
  checkErr(err)
  block, err := aes.NewCipher(key)
  checkErr(err)
  cbc := cipher.NewCBCEncrypter(block, iv)
  plainTextPadded := pkcs5Pad(plainText, cbc.BlockSize())
  cipherText := make([]byte, len(plainTextPadded))
  cbc.CryptBlocks(cipherText, plainTextPadded)
  return cipherText
}

func GetKey() (*Key, *Key) {
  clientKey := generateClientKey()
  if clientKey == nil {
    panic(fmt.Errorf("unable to generate client key"))
  }
  var serverKey Key
  data, _ := json.Marshal(*clientKey)
  resp, err := http.Post(ENDPOINT+"/exchange", "application/json", bytes.NewReader(data))
  if err != nil {
    log.Printf("%v", err)
    return nil, nil
  }
  responseData := make([]byte, resp.ContentLength)
  resp.Body.Read(responseData)

  if err := json.Unmarshal(responseData, &serverKey); err != nil {
    log.Printf("%v", err)
    return nil, nil
  }
  return &serverKey, clientKey
}

func genKeyIV() ([]byte, []byte) {
  serverKey, clientKey := GetKey()

  if serverKey == nil || clientKey == nil {
    panic(fmt.Errorf("can't get key"))
  }

  b := &clientKey.Private
  A, _ := new(big.Int).SetString(serverKey.Pub, 10)
  keyNum := new(big.Int).Exp(A, b, P)

  key := sha256.Sum256(keyNum.Bytes())
  iv := make([]byte, 16)
  _, err := rand.Read(iv)
  checkErr(err)
  return key[:], iv
}

func sendFile(data []byte) {
  encodedFile := base64.StdEncoding.EncodeToString(data)
  _, err := http.Post(ENDPOINT+"/flag", "text/plain", bytes.NewReader([]byte(encodedFile)))
  if err != nil {
    log.Printf("%v", err)
  }
}

func sendIV(iv, key []byte) {
  ecb, err := aes.NewCipher(key)
  if err != nil {
    panic(err)
  }
  encryptedIV := make([]byte, len(iv))
  ecb.Encrypt(encryptedIV, iv)
  encodedIV := base64.StdEncoding.EncodeToString(encryptedIV)

  _, err = http.Post(ENDPOINT+"/iv", "text/plain", bytes.NewReader([]byte(encodedIV)))
  if err != nil {
    log.Printf("%v", err)
  }
}

func main() {
  P, _ = new(big.Int).SetString("11512898481423045908909597690999304617675906599055494279436852276528040978541313176443384279737976378769444546595633262240923082096502599886532375800962119680890009703174357346140296440709120001", 10)
  G, _ = new(big.Int).SetString("7", 10)
  key, iv := genKeyIV()
  file := "./flag.txt"
  if _, err := os.Stat(file); err == nil {
    encryptedFile := encryptFile(file, key, iv)
    sendIV(iv, key)
    sendFile(encryptedFile)
  }
}
