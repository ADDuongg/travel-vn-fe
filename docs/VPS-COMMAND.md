# Sau khi thuê VPS — việc cần làm trên server

Tài liệu này chỉ mô tả **các bước thực hiện trên VPS** (Ubuntu). Cấu hình chi tiết ứng dụng (Docker Compose FE/BE, biến môi trường, SSL tự động) xem thêm [DEPLOY.md](./DEPLOY.md).

---

## 1. Kết nối SSH

- Dùng user `root` hoặc user mà nhà cung cấp VPS gửi kèm, kèm mật khẩu hoặc **SSH key** (khuyến nghị chỉ dùng key, tắt đăng nhập bằng mật khẩu sau khi setup xong).

```bash
ssh root@<IP_VPS>
# hoặc
ssh ubuntu@<IP_VPS>
```

---

## 2. Cập nhật hệ thống

```bash
sudo apt update
sudo apt upgrade -y
```

Khởi động lại nếu kernel được nâng cấp:

```bash
sudo reboot
```

Sau reboot, SSH vào lại.

---

## 3. (Tuỳ chọn) Tạo user thường + sudo

Tránh dùng `root` cho mọi thao tác hằng ngày:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
```

Chuyển SSH sang user mới (cấu hình key trong `~deploy/.ssh/authorized_keys` nếu cần), rồi dùng `deploy` cho các bước sau.

---

## 4. Múi giờ và đồng hồ hệ thống

```bash
sudo timedatectl set-timezone Asia/Ho_Chi_Minh
timedatectl status
```

---

## 5. Tường lửa (UFW)

Chỉ mở port cần thiết; **SSH** phải được phép trước khi `enable`, kẻo khóa mất kết nối.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Nếu bạn **không** dùng Nginx/Docker mà chạy API trực tiếp trên host và cần mở thêm port (ví dụ 9001), chỉ mở khi thật sự cần và cân nhắc chỉ cho phép qua reverse proxy.

---

## 6. Cài Docker và Docker Compose

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

Đăng xuất SSH và đăng nhập lại (hoặc `newgrp docker`) để nhóm `docker` có hiệu lực.

Kiểm tra:

```bash
docker --version
docker compose version
```

---

## 7. Cài Git (để clone mã nguồn)

```bash
sudo apt install -y git
```

---

## 8. Thư mục làm việc và clone project

Ví dụ đặt code dưới home:

```bash
mkdir -p ~/apps
cd ~/apps
git clone <URL_REPO_FE> react-vite
# Nếu BE nằm repo khác:
# git clone <URL_REPO_BE> nestjs-tours
```

Trên VPS chỉ cần **một bản clone** đúng branch/tag bạn deploy (thường `main` hoặc `production`).

---

## 9. Kiểm tra nhanh trước khi deploy ứng dụng

- **RAM / disk:**

  ```bash
  free -h
  df -h
  ```

- **Domain đã trỏ về IP VPS** (làm ở nhà cung cấp DNS, không phải trên VPS). Trên VPS có thể kiểm tra:

  ```bash
  dig +short yourdomain.com
  ```

  Kết quả phải là IP VPS trước khi xin chứng chỉ SSL (Let’s Encrypt).

---

## 10. Deploy ứng dụng

Tiếp theo: chỉnh `.env` / `.env.production` trong từng repo, cấu hình `docker-compose`, chạy `./deploy.sh` hoặc `docker compose up -d --build` theo [DEPLOY.md](./DEPLOY.md).

---

## 11. (Tuỳ chọn) Bảo mật và vận hành

- **Cập nhật tự động bảo mật** (Ubuntu):

  ```bash
  sudo apt install -y unattended-upgrades
  sudo dpkg-reconfigure -plow unattended-upgrades
  ```

- **fail2ban** (giảm brute-force SSH): `sudo apt install fail2ban` rồi bật dịch vụ theo tài liệu Ubuntu.

- **Sao lưu**: định kỳ backup volume Docker (Mongo, file upload) hoặc snapshot VPS theo chính sách nhà cung cấp.

---

Tóm lại: trên VPS bạn cần **SSH an toàn**, **hệ thống cập nhật**, **UFW**, **Docker**, **Git**, **clone code**, kiểm tra **DNS → IP**, sau đó mới chạy các lệnh deploy trong tài liệu dự án.
