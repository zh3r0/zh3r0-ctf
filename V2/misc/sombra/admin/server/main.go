package main

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"net/http"

	"github.com/gin-gonic/gin"
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

func generateServerKey() *Key {
	a, err := getRandomNumber()
	if err != nil {
		return nil
	}
	A := new(big.Int).Exp(G, a, P)
	return &Key{
		Pub:     A.String(),
		Private: *a,
	}
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	P, _ = new(big.Int).SetString("11512898481423045908909597690999304617675906599055494279436852276528040978541313176443384279737976378769444546595633262240923082096502599886532375800962119680890009703174357346140296440709120001", 10)
	G, _ = new(big.Int).SetString("7", 10)

	router := gin.Default()

	router.POST("/exchange", func(ctx *gin.Context) {
		var clientKey Key
		if err := ctx.ShouldBindJSON(&clientKey); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status": "bad request",
			})
			return
		}
		serverKey := generateServerKey()
		fmt.Printf("A=%s\n B=%s\n", serverKey.Pub, clientKey.Pub)
		ctx.JSON(http.StatusOK, serverKey)
	})

	router.POST("/flag", func(ctx *gin.Context) {
		data := make([]byte, ctx.Request.ContentLength)
		ctx.Request.Body.Read(data)
		fmt.Printf("encflag=%s\n", string(data))
	})

	router.POST("/iv", func(ctx *gin.Context) {
		data := make([]byte, ctx.Request.ContentLength)
		ctx.Request.Body.Read(data)
		fmt.Printf("enciv=%s\n", string(data))
	})
	router.Run("0.0.0.0:8080")
}
