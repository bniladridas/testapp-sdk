# Database

This document describes the database setup, schema, and operations for TestApp.

## Overview

TestApp uses PostgreSQL for persistent data storage. The database stores user accounts and supports authentication and AI chat functionality.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Fields:**

- `id`: Auto-incrementing primary key
- `email`: Unique user email address
- `password_hash`: Bcrypt-hashed password
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Schema Migrations Table

```sql
CREATE TABLE schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

Tracks applied database migrations.

## Setup

### 1. Install PostgreSQL

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu:**

```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Or use a cloud provider:**

- Supabase
- Neon
- Railway
- Heroku Postgres

### 2. Create Database

```sql
CREATE DATABASE testapp;
```

Or with custom name:

```sql
CREATE DATABASE your_db_name;
```

### 3. Configure Environment

Copy `env.example` to `.env` and set:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/testapp
```

**Format:** `postgresql://username:password@host:port/database`

### 4. Run Migrations

Initialize the database schema:

```bash
npm run migrate
```

This creates tables and indexes.

## Scripts

### Database Migration

```bash
npm run migrate
```

- Creates tables and indexes
- Records migration version
- Safe to run multiple times (idempotent)

### Database Rollback (Development Only)

```bash
npm run rollback
```

⚠️ **WARNING:** Deletes all data! Use only in development.

### Database Testing

```bash
npm run test:db
```

- Tests database connectivity
- Creates/removes test users
- Validates CRUD operations
- Checks duplicate prevention

## Connection Pool

The application uses `pg` connection pooling:

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**Pool Configuration:**

- Max 20 connections
- 30 second idle timeout
- 2 second connection timeout
- SSL in production

## Health Checks

### Basic Health Check

`GET /api/health`

```json
{
  "status": "ok",
  "timestamp": "2025-11-14T12:00:00.000Z",
  "database": "connected"
}
```

### Detailed Database Status

`GET /api/health/database`

```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "responseTime": "5ms",
    "pool": {
      "total": 2,
      "idle": 1,
      "waiting": 0
    }
  }
}
```

## Development

### Reset Database (Testing)

`POST /api/test/reset`

Clears all users. Available only in development mode.

### Local Development Setup

1. Start PostgreSQL locally
2. Create database: `createdb testapp`
3. Set `DATABASE_URL` in `.env`
4. Run `npm run migrate`
5. Start app: `npm run dev`

## Production Considerations

### Connection Security

- Use SSL/TLS connections (`sslmode=require`)
- Store credentials securely (environment variables)
- Use connection pooling to limit connections

### Backup Strategy

TestApp includes automated PostgreSQL backup functionality:

#### Automated Backups

Run database backups using the provided script:

```bash
npm run backup
```

This creates timestamped SQL dumps in the `backups/` directory.

#### Backup Script Details

- **Location**: `tools/scripts/backup.js`
- **Format**: PostgreSQL dump (SQL)
- **Naming**: `backup-YYYY-MM-DDTHH-MM-SS.sssZ.sql`
- **Logging**: Backup operations logged to `backups/backup.log`

#### Manual Backup

```bash
# Using pg_dump directly
pg_dump "your_database_url" > backup.sql

# Or using the npm script
npm run backup
```

#### Restoration

To restore from a backup:

```bash
psql "your_database_url" < backup.sql
```

#### Best Practices

- Run backups regularly (daily/weekly)
- Store backups securely off-site
- Test restoration procedures periodically
- Monitor backup success/failure

### Performance

- Monitor connection pool usage
- Add indexes for query optimization
- Consider read replicas for high traffic

### Monitoring

- Track query performance
- Monitor connection pool stats
- Set up alerts for connection failures

## Troubleshooting

### Connection Failed

- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists
- Test connection: `psql $DATABASE_URL -c "SELECT 1"`

### Migration Errors

- Check database permissions
- Verify PostgreSQL version compatibility
- Run migrations as database owner

### Pool Exhaustion

- Increase pool size if needed
- Check for connection leaks
- Monitor query execution time

## Migration Files

Located in `tools/scripts/migrate.js` - handles schema creation and versioning.</content>
<parameter name="filePath">docs/database.md
