# diemquynh.fun

Hướng dẫn cài đặt và triển khai website với Docker và Nginx SSL.

## Yêu cầu hệ thống
- Docker và Docker Compose
- Domain đã trỏ DNS về server (diemquynh.fun và api.diemquynh.fun)
- Ubuntu/Debian server
- Ports 80 và 443 đã được mở

## Các bước cài đặt

### 1. Cài đặt Certbot để lấy SSL
```bash
sudo apt update
sudo apt install certbot
```

### 2. Lấy SSL certificates
```bash
# Dừng nginx nếu đang chạy để tránh xung đột port 80
docker-compose down

# Lấy certificate cho domain chính
sudo certbot certonly --standalone -d diemquynh.fun

# Lấy certificate cho subdomain API
sudo certbot certonly --standalone -d api.diemquynh.fun
```

### 3. Cấu trúc thư mục
```
.
├── docker-compose.yml
├── fe/                 # Frontend React code
├── be/                 # Backend code
└── nginx/
    ├── Dockerfile
    ├── conf/
    │   └── default.conf
    └── ssl/
        ├── cert.pem
        ├── key.pem
        ├── api-cert.pem
        └── api-key.pem
```

### 4. Tạo thư mục và copy SSL certificates
```bash
# Tạo cấu trúc thư mục
mkdir -p nginx/conf nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/diemquynh.fun/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/diemquynh.fun/privkey.pem nginx/ssl/key.pem
sudo cp /etc/letsencrypt/live/api.diemquynh.fun/fullchain.pem nginx/ssl/api-cert.pem
sudo cp /etc/letsencrypt/live/api.diemquynh.fun/privkey.pem nginx/ssl/api-key.pem

# Phân quyền
sudo chmod 644 nginx/ssl/*.pem
```

### 5. Tạo Dockerfile cho Nginx
```dockerfile
# nginx/Dockerfile
FROM nginx:alpine

COPY conf/default.conf /etc/nginx/conf.d/default.conf
```

### 6. Tạo file cấu hình Nginx
Tạo file `nginx/conf/default.conf` với nội dung:
```nginx
server {
    listen 80;
    server_name diemquynh.fun api.diemquynh.fun;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name diemquynh.fun;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 443 ssl;
    server_name api.diemquynh.fun;
    
    ssl_certificate /etc/nginx/ssl/api-cert.pem;
    ssl_certificate_key /etc/nginx/ssl/api-key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=31536000" always;

    location / {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 7. Cấu hình Docker Compose
File `docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./fe
      dockerfile: Dockerfile
    # ... other frontend configs ...

  backend:
    build:
      context: ./be
      dockerfile: Dockerfile
    # ... other backend configs ...

  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
```

### 8. Cấu hình tự động gia hạn SSL
```bash
sudo crontab -e

# Thêm dòng sau
0 12 * * * /usr/bin/certbot renew --quiet
```

### 9. Khởi động ứng dụng
```bash
# Build và chạy containers
docker-compose build
docker-compose up -d

# Kiểm tra logs
docker-compose logs -f
```

## Truy cập website
- Frontend: https://diemquynh.fun
- Backend API: https://api.diemquynh.fun

## Lưu ý bảo mật
- Đảm bảo các file SSL certificate được bảo vệ đúng cách
- Cập nhật SSL certificates trước khi hết hạn
- Kiểm tra và cập nhật các security headers trong Nginx config
- Cấu hình CORS trong backend để chỉ chấp nhận requests từ domain chính

## Hướng dẫn chi tiết lấy SSL Certificate

### 1. Chuẩn bị
- Đảm bảo đã trỏ DNS records cho cả 2 domain:
  + Domain chính (diemquynh.fun) -> trỏ tới IP server
  + Subdomain API (api.diemquynh.fun) -> trỏ tới cùng IP server
- Mở ports 80 và 443 trên firewall:
```bash
# Kiểm tra firewall status
sudo ufw status

# Mở ports nếu chưa mở
sudo ufw allow 80
sudo ufw allow 443
```

### 2. Cài đặt Certbot
```bash
# Cập nhật package list
sudo apt update

# Cài đặt certbot
sudo apt install certbot -y
```

### 3. Lấy SSL Certificate cho từng domain

#### 3.1. Dừng các services đang sử dụng port 80
```bash
# Nếu đang chạy docker
docker-compose down

# Hoặc dừng nginx nếu đang chạy trực tiếp
sudo systemctl stop nginx
```

#### 3.2. Lấy certificate cho domain chính
```bash
sudo certbot certonly --standalone -d diemquynh.fun

# Certbot sẽ yêu cầu:
# - Email address (để thông báo khi certificate sắp hết hạn)
# - Đồng ý điều khoản dịch vụ
# - Chia sẻ email (có thể từ chối)
```

#### 3.3. Lấy certificate cho subdomain API
```bash
sudo certbot certonly --standalone -d api.diemquynh.fun
```

#### 3.4. Kiểm tra certificates đã lấy được
```bash
sudo certbot certificates
```

### 4. Vị trí lưu trữ certificates
Certificates sẽ được lưu tại các vị trí sau:

- Domain chính (diemquynh.fun):
  + Certificate: `/etc/letsencrypt/live/diemquynh.fun/fullchain.pem`
  + Private key: `/etc/letsencrypt/live/diemquynh.fun/privkey.pem`

- Subdomain API (api.diemquynh.fun):
  + Certificate: `/etc/letsencrypt/live/api.diemquynh.fun/fullchain.pem`
  + Private key: `/etc/letsencrypt/live/api.diemquynh.fun/privkey.pem`

### 5. Copy certificates vào thư mục nginx
```bash
# Tạo thư mục ssl nếu chưa có
mkdir -p nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/diemquynh.fun/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/diemquynh.fun/privkey.pem nginx/ssl/key.pem
sudo cp /etc/letsencrypt/live/api.diemquynh.fun/fullchain.pem nginx/ssl/api-cert.pem
sudo cp /etc/letsencrypt/live/api.diemquynh.fun/privkey.pem nginx/ssl/api-key.pem

# Phân quyền để nginx có thể đọc
sudo chmod 644 nginx/ssl/*.pem
```

### 6. Cấu hình tự động gia hạn certificate
```bash
# Mở crontab editor
sudo crontab -e

# Thêm dòng sau để tự động gia hạn vào 12:00 AM mỗi ngày
0 12 * * * /usr/bin/certbot renew --quiet

# Kiểm tra các cronjob đã cấu hình
sudo crontab -l
```

### 7. Kiểm tra ngày hết hạn của certificates
```bash
# Kiểm tra tất cả certificates
sudo certbot certificates

# Hoặc kiểm tra từng domain
echo | openssl s_client -servername diemquynh.fun -connect diemquynh.fun:443 2>/dev/null | openssl x509 -noout -dates
echo | openssl s_client -servername api.diemquynh.fun -connect api.diemquynh.fun:443 2>/dev/null | openssl x509 -noout -dates
```