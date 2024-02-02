echo "Initializing database..."
pnpm run migrate:up

echo "Initializing database..."
pnpm run init:db

echo "Setting up test user..."