Tôi muốn bạn đóng vai một DevOps Engineer senior và thiết kế cho tôi một hệ thống deploy production-ready với các yêu cầu sau:

1. Kiến trúc tổng thể:

- Frontend: React (Vite), build thành static files
- Backend: NestJS
- Database: MongoDB
- Cache: Redis
- Reverse proxy: Nginx (chỉ dùng riêng cho từng service, KHÔNG dùng proxy chung FE + BE)
- Docker hóa toàn bộ hệ thống

2. Domain:

- Production:
  - FE: https://abc.com
  - BE: https://api.abc.com

- Staging:
  - FE: https://staging.abc.com
  - BE: https://api.staging.abc.com

3. Yêu cầu deploy:

- FE và BE deploy độc lập (2 repo riêng)
- FE dùng build-time env (VITE\_\*)
- BE dùng runtime env (env_file / environment)
- Không được bake secret vào Docker image
- Deploy trên VPS bằng docker-compose

4. Cấu trúc repo:

- FE repo:
  - Dockerfile (multi-stage build + nginx)
  - .env.example

- BE repo:
  - Dockerfile (NestJS production)
  - docker-compose.yml (bao gồm MongoDB + Redis)
  - .env.example

5. Yêu cầu bạn cung cấp:

- Dockerfile chuẩn cho:
  - FE (build + nginx)
  - BE (NestJS production)

- docker-compose.yml cho BE (MongoDB + Redis + backend)
- docker-compose.yml cho FE
- File .env.example cho cả FE và BE
- Cách tổ chức env cho:
  - development
  - staging
  - production

6. Networking:

- FE gọi API qua domain BE (không proxy)
- Cấu hình CORS chuẩn cho NestJS
- Cấu hình Nginx:
  - serve FE
  - expose BE qua domain + port

7. SSL:

- Cấu hình SSL với Let's Encrypt hoặc tương đương
- Hướng dẫn renew SSL tự động

8. GitLab CI/CD:

- Viết file .gitlab-ci.yml cho:
  - FE repo
  - BE repo

- Pipeline gồm:
  - build Docker image
  - tag image (staging / production)
  - push lên registry (GitLab Container Registry hoặc Docker Hub)
  - deploy lên VPS qua SSH

- Sử dụng GitLab CI/CD variables (secrets) để:
  - lưu DATABASE_URL
  - JWT_SECRET
  - SSH_PRIVATE_KEY

- Phân tách pipeline:
  - branch develop → deploy staging
  - branch main → deploy production

9. Deploy flow:

- VPS pull image từ registry
- docker-compose up -d
- Không build trên VPS

10. Khả năng mở rộng:

- scale backend nhiều container
- tách MongoDB / Redis thành service riêng
- gợi ý migrate sang Kubernetes sau này

11. Best practices:

- không commit .env thật
- chỉ dùng .env.example
- logging cơ bản
- restart policy container
- rollback khi deploy lỗi

Yêu cầu output:

- Có sơ đồ kiến trúc (text diagram)
- Có code mẫu đầy đủ (Dockerfile, docker-compose, gitlab-ci)
- Giải thích ngắn gọn, thực tế, dễ áp dụng
