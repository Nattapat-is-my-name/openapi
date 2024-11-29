package routes

import (
	"backend/internal/controller"
	"github.com/gin-gonic/gin"
)

type IRouterGroup interface {
	InitializedGroup(app *gin.Engine)
}

type AuthRouter struct {
	controller controller.IAuthController
}

func ProvideAuthRouter(controller controller.IAuthController) AuthRouter {
	return AuthRouter{
		controller: controller,
	}
}

func (r *AuthRouter) InitializedGroup(app *gin.Engine) {
	userAPI := app.Group("/auth")
	{
		userAPI.POST("/login", r.controller.Login)
		userAPI.POST("/register", r.controller.Register)
	}

}
