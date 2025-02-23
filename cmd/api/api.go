package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/dotcomnerd/seleneo/internal/repository"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"go.uber.org/zap"

	"github.com/dotcomnerd/seleneo/internal/env"
)

type application struct {
	config config
	logger *zap.SugaredLogger
	repo   repository.Storage
}

type config struct {
	addr string
	env  string
	db   dbConfig
}

type dbConfig struct {
	connStr      string
	maxIdleTime  string
	maxConn      int
	maxIdleConns int
}

func (app *application) mount() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{env.GetString("CORS_ALLOWED_ORIGIN", "http://localhost:3000")},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		// ExposedHeaders:   []string{"Link"}, dont htink i need this ngl
		AllowCredentials: false,
		MaxAge:           300,
	}))
	r.Use(middleware.Timeout(30 * time.Second))

	r.Route("/api", func(r chi.Router) {
		r.Route("/v1", func(r chi.Router) {
			r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
				w.Write([]byte("we gon be ok, ok the hardest, istg"))
			})

			r.Post("/save", app.uploadImageHandler)

			r.Route("/users", func(r chi.Router) {
				r.Delete("/{userId}", app.deleteUserHandler)
				r.Get("/{userId}", app.getUser)
			})
		})
	})

	return r
}

func (app *application) run(mux http.Handler) error {

	server := &http.Server{
		Addr:         app.config.addr,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  15 * time.Second,
	}

	shutdown := make(chan error)

	go func() {
		quit := make(chan os.Signal, 1)

		signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
		s := <-quit

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		app.logger.Infow("signal got caught lacking", "signal", s.String())

		shutdown <- server.Shutdown(ctx)
	}()

	app.logger.Infow("server is running", "addr", app.config.addr)

	err := server.ListenAndServe()
	if err != http.ErrServerClosed {
		return err
	}

	if err := <-shutdown; err != nil {
		return err
	}

	app.logger.Info("server stopped thankfully")

	return nil
}
