SELECT 'CREATE DATABASE fudodb' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fudodb')\gexec