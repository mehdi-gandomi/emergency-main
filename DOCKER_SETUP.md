# Docker Setup Guide

This project uses Docker Compose to run the Laravel backend and React frontend together.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

1. **Create environment files** (if they don't exist):
   - `backend/.env` - Laravel environment configuration
   - `frontend/.env` - React environment configuration (optional)

2. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the applications:**
   - Frontend (React): http://localhost:3000
   - Backend (Laravel API): http://localhost:8000
   - phpMyAdmin: http://localhost:8080

## Services

### Backend (Laravel)
- **Container**: `emergency_backend`
- **Port**: 8000
- **Health**: Automatically runs migrations on startup

### Frontend (React)
- **Container**: `emergency_frontend`
- **Port**: 3000
- **Hot Reload**: Enabled for development

### MySQL Database
- **Container**: `emergency_mysql`
- **Port**: 3306
- **Default Database**: `emergency_db`
- **Default User**: `emergency_user`
- **Default Password**: `emergency_pass`

### phpMyAdmin
- **Container**: `emergency_phpmyadmin`
- **Port**: 8080
- **Access**: http://localhost:8080

## Environment Variables

Create a `.env` file in the project root or set environment variables:

```env
APP_ENV=local
APP_DEBUG=true
DB_CONNECTION=mysql
DB_DATABASE=emergency_db
DB_USERNAME=emergency_user
DB_PASSWORD=emergency_pass
DB_ROOT_PASSWORD=root_password
VITE_API_URL=http://localhost:8000
```

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Execute commands in containers
```bash
# Run Laravel Artisan commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan cache:clear

# Run npm commands in frontend
docker-compose exec frontend npm install
docker-compose exec frontend npm run build
```

### Rebuild containers
```bash
docker-compose up -d --build
```

### Access shell
```bash
# Backend shell
docker-compose exec backend bash

# Frontend shell
docker-compose exec frontend sh
```

## Troubleshooting

### Port already in use
If ports 3000, 8000, or 3306 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Change 3000 to 3001
```

### Permission issues (Linux/Mac)
```bash
sudo chown -R $USER:$USER backend/storage backend/bootstrap/cache
```

### Database connection issues
1. Check if MySQL container is healthy:
   ```bash
   docker-compose ps
   ```
2. Wait for MySQL to be ready before accessing the backend
3. Verify database credentials in `.env` file

### Clear everything and start fresh
```bash
docker-compose down -v
docker-compose up -d --build
```

## Development Tips

1. **Hot Reload**: Frontend changes are automatically reflected in the browser
2. **Volume Mounts**: Code changes are immediately available in containers
3. **Database Persistence**: Data persists in Docker volumes even after container restart
4. **Composer/NPM**: Install dependencies inside containers or locally (they'll sync via volumes)

## Production Considerations

For production deployment:
- Set `APP_ENV=production` and `APP_DEBUG=false`
- Use proper environment variables
- Build production assets: `docker-compose exec frontend npm run build`
- Use a proper web server (nginx/apache) instead of PHP built-in server
- Configure proper database credentials
- Remove phpMyAdmin service

