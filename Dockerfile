FROM node:18-bullseye

# Install PostgreSQL
RUN apt-get update && \
    apt-get install -y postgresql postgresql-contrib && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Setup PostgreSQL data directory permissions
RUN mkdir -p /var/lib/postgresql/data && chown -R postgres:postgres /var/lib/postgresql

# Copy your SQL init script for DB setup
COPY init.sql /docker-entrypoint-initdb.d/init.sql

# Copy backend and frontend code
COPY test-case-backend /app/backend
COPY test-case-frontend /app/frontend

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Build frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Move frontend build to backend public folder for serving
RUN cp -r build ../backend/public

# Copy start.sh and give execution permission
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose the port your backend serves on
EXPOSE 3000

# Start everything with start.sh script
CMD ["/start.sh"]
