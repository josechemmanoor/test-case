#!/bin/bash

# Initialize PostgreSQL database (run as postgres user)
su - postgres -c "/usr/lib/postgresql/13/bin/initdb -D /var/lib/postgresql/data"

# Start PostgreSQL server (run as postgres user)
/etc/init.d/postgresql start

# Wait a few seconds to make sure postgres is up
sleep 5

# Create your database and load init.sql
su - postgres -c "psql -f /docker-entrypoint-initdb.d/init.sql"

# Move to backend folder and start Node.js backend
cd /app/backend

# Start the backend (adjust this if you use a different start command)
npm start
