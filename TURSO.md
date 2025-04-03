# Migrating to Turso

This project has migrated from PostgreSQL to Turso, a libSQL-based database with built-in AI embedding capabilities.

## Setup Instructions

### 1. Install Turso CLI

```bash
# macOS
brew install tursodatabase/tap/turso

# Linux
curl -sSfL https://get.tur.so/install.sh | bash

# Windows (using scoop)
scoop bucket add turso https://github.com/tursodatabase/scoop-bucket
scoop install turso
```

### 2. Authenticate with Turso

```bash
turso auth login
```

### 3. Create a Database

```bash
turso db create my-database
```

### 4. Get Database Credentials

```bash
# Get the database URL
turso db show --url my-database

# Create an auth token
turso db tokens create my-database
```

### 5. Update Environment Variables

Add the Turso credentials to your `.env` file:

```
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### 6. Run Migrations

```bash
npm run db:generate
npm run db:migrate
```

## Working with AI Embeddings

Turso supports AI embeddings natively. The project has been updated to work with Turso's embedding approach. The key changes:

1. Embeddings are stored as JSON text in the database
2. We use full-text search for initial filtering
3. Cosine similarity is calculated in-memory for final ranking

## Benefits of Turso

- Edge computing with low latency
- No cold starts
- Built-in vector search
- Simple developer experience
- Cost-effective
- Seamless local development

## References

- [Turso Documentation](https://docs.turso.tech/)
- [Drizzle ORM with Turso](https://orm.drizzle.team/docs/get-started/turso-new)
