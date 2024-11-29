package di

import (
	"backend/cmd/api/docs"
	"backend/internal/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type IPillar interface {
	RunApp() error
}

type Pillar struct {
	app   *gin.Engine
	route routes.IRouter
}

// @BasePath /api/v1

func (p *Pillar) RunApp() error {
	// Add CORS middleware before other middleware
	p.app.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // Preflight request cache duration
	}))

	p.app.Use(gin.Recovery())
	p.app.Use(gin.Logger())

	p.route.InitializedRouter(p.app)
	docs.SwaggerInfo.BasePath = "/"
	p.app.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	return p.app.Run(":8000")
}

func ProvideGinEngine(route routes.IRouter) IPillar {
	app := gin.New()

	return &Pillar{
		app:   app,
		route: route,
	}
}
