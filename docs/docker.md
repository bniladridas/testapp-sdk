# Docker

TestApp includes Docker support for containerized deployment. The application is packaged as a multi-stage Docker image for optimal size and security.

## Linting the Dockerfile

Use Hadolint to lint the Dockerfile for best practices:

```sh
# Install Hadolint (if not installed)
brew install hadolint  # macOS
# or download from https://github.com/hadolint/hadolint

# Lint the Dockerfile
hadolint docker/Dockerfile
```

## Building Locally

To build the Docker image locally:

```sh
docker build -t testapp:latest -f docker/Dockerfile .
```

## Running Locally

Run the container:

```sh
docker run -p 3001:3001 --env-file .env testapp:latest
```

The application will be available at `http://localhost:3001`.

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google Gemini API key
- `JWT_SECRET`: JWT secret for authentication

## Docker Image Details

- **Base Image**: Node.js 20 Alpine Linux
- **Multi-stage Build**: Separate build and production stages for smaller final image
- **Security**: Runs as non-root user, includes health checks
- **Health Check**: Monitors `/api/health` endpoint
- **Signal Handling**: Uses `dumb-init` for proper signal handling

## Automated Builds

The Docker image is automatically built and pushed on:

- Pushes to the `main` branch
- Releases (tagged versions)

Images are pushed to:

- **Docker Hub**: `docker.io/${DOCKER_USERNAME}/${REPO_NAME}`
- **GitHub Container Registry**: `ghcr.io/${GITHUB_REPOSITORY}`

### Tags

Images are tagged with:

- `latest`: Latest build from main
- Branch names (e.g., `main`, `feature/branch`)
- SHA prefixes (e.g., `main-abc1234`)
- Semantic versions on releases (e.g., `1.0.0`, `1.0`, `1`)

## Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test GitHub Actions workflows locally with Docker.

### Prerequisites

- Install act: `brew install act` (macOS) or download from GitHub releases
- Ensure Docker Desktop is running

### Running the Docker Workflow

Test the Docker build and push workflow:

```sh
# Test the docker workflow
act -j build-and-push -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --secret DOCKER_USERNAME=your_username --secret DOCKER_PASSWORD=your_password --secret GH_PAT=your_github_pat
```

**Note**: This will attempt to push images. For testing without pushing, modify the workflow temporarily to set `push: false`.

### Running Other Workflows

Test the e2e workflow:

```sh
act -j e2e -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --secret GEMINI_API_KEY=your_key
```

### Validating Workflows

Before pushing, validate the workflow YAML:

```sh
npx yaml-lint .github/workflows/docker.yml
```

This checks for syntax errors and formatting issues.

### Common Issues

- **Docker not running**: Ensure Docker Desktop is started
- **Permissions**: `act` requires Docker access
- **Secrets**: Provide required secrets or mock them for testing
- **Platform**: Use `--container-architecture linux/amd64` on Apple Silicon

## Security Scanning

Images are automatically scanned for vulnerabilities using Trivy on the Docker Hub image. Results are uploaded to GitHub Security tab as SARIF reports.

## Validating the Image

After building, validate the image:

```sh
# Check image layers and size
docker images testapp:latest

# Run basic health check
docker run --rm -p 3001:3001 --env DATABASE_URL=postgresql://test:test@localhost:5432/test --env GEMINI_API_KEY=dummy --env JWT_SECRET=test testapp:latest &
sleep 10
curl http://localhost:3001/api/health
kill %1

# Validate with Trivy locally (if installed)
trivy image testapp:latest
```

## Production Deployment

For production deployment:

1. Pull the image: `docker pull ghcr.io/your-org/testapp:latest`
2. Run with production environment variables
3. Use a reverse proxy (nginx) for SSL termination
4. Configure logging and monitoring

## Files

- `docker/Dockerfile`: Multi-stage build configuration
- `.dockerignore`: Files excluded from build context
- `.github/workflows/docker.yml`: CI/CD workflow for building and pushing images
