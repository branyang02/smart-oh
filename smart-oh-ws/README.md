# SmarOH Websocket Server

## Development

### Prerequisites

[`uv`](https://docs.astral.sh/uv/getting-started/installation/) needs to be installed.

### Installation

```bash
uv sync # Install dependencies
uv run fastapi dev src/main.py # Run the server
```

## Production

### Steps

1. Setup Environment Variables
2. Run!

```bash
pip install -r requirements.txt
fastapi run src/main.py
```

## AWS EC2 Instance

1. Create an EC2 instance, choose Ubuntu, create elastic IP, and associate it with the instance.
2. Install `uv`

    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

3. Clone repo and test the server

    ```bash
    uv sync
    uv run fastapi dev src/main.py
    ```

4. Install `nginx`

    ```bash
    sudo apt update
    sudo apt install nginx
    ```

5. Configure `nginx`

    5.1. Create SSL Certificate

    ```bash
    sudo mkdir -p /etc/nginx/ssl 
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx-selfsigned.key \
    -out /etc/nginx/ssl/nginx-selfsigned.crt
    ```

    5.2. Create a configuration file

    ```bash
    sudo vim /etc/nginx/sites-enabled/fastapi_nginx
    ```

    Add the following configuration

    ```nginx
    server {
    listen 80;
    server_name [elastic_ip_dns]; # *.compute.amazonaws.com
    return 301 https://$host$request_uri;  # Redirect all HTTP to HTTPS

    }

    server {
        listen 443 ssl;
        server_name [elastic_ip_dns]; # *.compute.amazonaws.com

        ssl_certificate /etc/nginx/ssl/nginx-selfsigned.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx-selfsigned.key;

        location / {
            proxy_pass http://127.0.0.1:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location /ws/ {
            proxy_pass http://127.0.0.1:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
        }
    }
    ```

    ```bash
    sudo systemctl restart nginx
    sudo nginx -t
    sudo systemctl reload nginx
    ```

    Test the server by visiting the elastic IP DNS. `https://[elastic_ip_dns]`. You should see the FastAPI server running and ready to connect message.

    ```json
    {"message":"The webSocket server is running and ready to connect!"}
    ```

6. Configure `systemctl`

```bash
sudo vim /etc/systemd/system/smart-oh-[environment].service # environment: preview, production
```

```systemd
[Unit]
Description=FastAPI WebSocket Server
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/smart-oh-preview/smart-oh-ws
ExecStart=/home/ubuntu/.local/bin/uv run fastapi run src/main.py
Restart=always
Environment="PATH=/home/ubuntu/.local/bin:/usr/bin:/bin"
Environment="HOME=/home/ubuntu"

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl start smart-oh-[environment] # starts the service
```
