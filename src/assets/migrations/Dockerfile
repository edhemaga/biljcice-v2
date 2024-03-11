FROM mysql:latest

# Copy initialization scripts to docker-entrypoint-initdb.d
COPY ./initialize_db.sql /docker-entrypoint-initdb.d/init.sql

# Define environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=biljcice
ENV MYSQL_PASSWORD=admin

# Expose MySQL default port
EXPOSE 3306
