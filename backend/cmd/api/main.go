//go:generate swag init --dir ../.. --generalInfo cmd/api/main.go --output ./docs
package main

import "backend/cmd/api/di"

// @title My API
// @version 1.0
// @description This is the main entry point for the API service.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name MIT
// @license.url https://opensource.org/licenses/MIT

// @host localhost:8000
// @BasePath /auth

// @securityDefinitions.apiKey ApiKeyAuth
// @in header
// @name Authorization

// main function to initialize and run the application
func main() {
	app, err := di.InitializedApp()
	if err != nil {
		return
	}
	err = app.RunApp()
	if err != nil {
		return
	}
}
