package controller

import (
	"backend/internal/controller/dtos"
	"backend/internal/service"
	"github.com/gin-gonic/gin"
	"log"
)

type IAuthController interface {
	Login(ctx *gin.Context)
	Register(ctx *gin.Context)
}

type AuthController struct {
	authService  service.IAuthService
	tokenService service.ITokenService
}

func ProvideAuthController(authService service.IAuthService, tokenService service.ITokenService) IAuthController {
	return AuthController{
		authService:  authService,
		tokenService: tokenService,
	}
}

// Login godoc
// @Router /auth/login [post]
// @Summary Login
// @Description Authenticates a user and generates a token upon successful login
// @Tags Auth
// @Accept json
// @Produce json
// @Param loginRequest body dtos.LoginRequest true "Login request payload"
// @Success 200 {object} dtos.LoginResponse "Successfully logged in and returned user details with token"
func (a AuthController) Login(ctx *gin.Context) {
	var loginRequest dtos.LoginRequest
	err := ctx.ShouldBindBodyWithJSON(&loginRequest)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user, err := a.authService.Login(loginRequest.Username, loginRequest.Password)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := a.tokenService.GenerateToken(user.Username)

	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	res := dtos.LoginResponse{
		Username: user.Username,
		Email:    user.Email,
		Token:    token,
	}
	ctx.JSON(200, res)
}

// Register godoc
// @Summary Register a new user
// @Description Creates a new user account and returns authentication token
// @Tags Auth
// @Accept json
// @Produce json
// @Param request body dtos.RegisterRequest true "Registration Details"
// @Success 200 {object} dtos.LoginResponse "Successfully registered and returned user details with token"
// @Router /auth/register [post]  // Changed to lowercase
func (a AuthController) Register(ctx *gin.Context) {
	var registerRequest dtos.RegisterRequest

	// Changed from ShouldBindBodyWithJSON to ShouldBindJSON
	err := ctx.ShouldBindJSON(&registerRequest)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Add debug logging
	log.Printf("Received registration request: %+v", registerRequest)

	user, err := a.authService.Register(registerRequest.Username, registerRequest.Password, registerRequest.Email)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	token, err := a.tokenService.GenerateToken(user.Username)
	if err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	res := dtos.LoginResponse{
		Username: user.Username,
		Email:    user.Email,
		Token:    token,
	}
	ctx.JSON(200, res)
}
