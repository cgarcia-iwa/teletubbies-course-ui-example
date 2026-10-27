# TeletubbiesCourseExampleFe

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Docker

The app is packaged as a multi-stage image: Node compiles the Angular app and nginx serves the static files. You need Docker with the Compose plugin.

```bash
# Build the image and start the container in the background
make docker-build

# Stop and remove the web container
make docker-down-ui
```

Once running, open `http://localhost:8081/`. The container is named `course_ui` and nginx listens on port `80` inside it.

Useful commands:

```bash
docker compose logs -f web   # follow logs
docker compose ps            # check status
docker compose down          # stop and remove everything
```

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BUILD_ENV` | `development` | Angular configuration compiled into the image. Accepted values: `development`, `production`. |

`BUILD_ENV` selects the Angular configuration compiled into the image. Override it per build:

```bash
BUILD_ENV=production docker compose up --build
```

You can also set it in a local `.env` file (optional and git-ignored):

```dotenv
BUILD_ENV=production
```

Without Compose, the equivalent is:

```bash
docker build --build-arg BUILD_ENV=production -t course-ui .
docker run --rm -p 8081:80 course-ui
```

The nginx configuration includes gzip, long-lived caching for hashed assets, and SPA fallback so routes like `/courses` work on refresh.

> **Note:** `apiBaseUrl` is not an environment variable. It is defined at compile time in `src/environments/environment.ts` (development) and `src/environments/environment.prod.ts` (production), and selected by `BUILD_ENV` through Angular's `fileReplacements`.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
