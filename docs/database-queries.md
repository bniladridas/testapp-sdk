# Database Queries

This document contains useful SQL queries for managing the TestApp database on Neon.

## User Management

### Count total users

```sql
SELECT COUNT(*) FROM users;
```

### List all users

```sql
SELECT id, email, created_at FROM users ORDER BY created_at DESC;
```

### Find user by email

```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

### Delete a user (be careful!)

```sql
DELETE FROM users WHERE email = 'user@example.com';
```

## Database Maintenance

### Check table structure

```sql
\d users
```

### Reset database (for testing)

```sql
DELETE FROM users;
```

### Check database size

```sql
SELECT pg_size_pretty(pg_database_size(current_database()));
```

## Monitoring

### Recent signups (last 7 days)

```sql
SELECT COUNT(*) FROM users WHERE created_at > NOW() - INTERVAL '7 days';
```

### Users by signup date

```sql
SELECT DATE(created_at), COUNT(*) FROM users GROUP BY DATE(created_at) ORDER BY DATE(created_at) DESC;
```

## Connection Info

To connect via psql:

```bash
psql 'your_database_url_here'
```

Replace `your_database_url_here` with the `DATABASE_URL` from Neon.
