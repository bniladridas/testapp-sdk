# Security

This document outlines the security measures and best practices implemented in TestApp.

## Authentication & Authorization

### JWT Tokens

- **Algorithm**: HS256 (HMAC-SHA256)
- **Expiration**: 24 hours
- **Storage**: Client-side localStorage (not secure for sensitive applications)
- **Transmission**: Bearer token in Authorization header

### Password Security

- **Hashing**: bcrypt with salt rounds of 10
- **Storage**: Hashed passwords only (never plain text)
- **Validation**: Server-side password verification

## API Security

### Rate Limiting

- **Implementation**: express-rate-limit middleware
- **Default Limits**: Configurable per endpoint
- **Headers**: X-RateLimit-\* headers included in responses

### Input Validation

- **Sanitization**: Express.json() middleware for JSON parsing
- **Type Checking**: Runtime validation of request data
- **SQL Injection**: Protected by parameterized queries in PostgreSQL

### CORS Configuration

- **Development**: Allows all origins (`*`)
- **Production**: Restricted to configured domains via `ALLOWED_ORIGINS`

## Data Protection

### Environment Variables

- **Secrets**: API keys, JWT secrets, and private keys stored as environment variables
- **Validation**: Required environment variables checked at startup
- **Logging**: Sensitive data never logged

### Session Management

- **Storage**: Client-side localStorage
- **Cleanup**: Automatic logout on token expiration
- **Persistence**: Sessions survive browser refreshes

## GitHub Integration Security

### Webhook Verification

- **Signature**: HMAC-SHA256 signature verification
- **Secret**: Configured via `GITHUB_WEBHOOK_SECRET`
- **Validation**: All webhook requests verified before processing

### App Authentication

- **Type**: GitHub App (not OAuth)
- **Permissions**: Scoped to necessary operations only
- **Tokens**: Short-lived installation tokens

## Infrastructure Security

### HTTPS

- **Development**: HTTP only
- **Production**: Should be served over HTTPS (configure in deployment)

### Headers

- **Helmet.js**: Security headers middleware
- **CORS**: Cross-origin request protection
- **HSTS**: HTTP Strict Transport Security (when HTTPS enabled)

### Error Handling

- **Information Leakage**: Generic error messages
- **Stack Traces**: Not exposed in production
- **Logging**: Errors logged server-side only

## Development Security

### Dependencies

- **Auditing**: `npm audit` for vulnerability scanning
- **Updates**: Regular dependency updates
- **Lockfile**: package-lock.json ensures reproducible builds

### Code Security

- **Linting**: ESLint for code quality
- **Testing**: Comprehensive test coverage
- **Secrets**: No hardcoded secrets in codebase

## Production Considerations

### Database

- **Current**: PostgreSQL with connection pooling
- **Security**: Parameterized queries prevent SQL injection
- **Encryption**: Data at rest encryption recommended

### Monitoring

- **Logging**: Implement structured logging
- **Metrics**: Application performance monitoring
- **Alerts**: Security incident alerting

### Backup & Recovery

- **Data**: Regular database backups
- **Keys**: Secure key rotation procedures
- **Disaster Recovery**: Backup restoration procedures

## Security Checklist

### Pre-deployment

- [ ] Environment variables configured securely
- [ ] HTTPS enabled in production
- [ ] Database credentials secured
- [ ] API keys validated
- [ ] Rate limiting configured
- [ ] CORS origins restricted

### Ongoing Maintenance

- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Log monitoring
- [ ] Incident response plan
- [ ] Security training for developers

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly by creating an issue in the repository or contacting the maintainers directly. Do not disclose vulnerabilities publicly until they have been addressed.</content>
<parameter name="filePath">docs/security.md
