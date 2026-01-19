# Synology NAS Docker 배포 가이드

이 가이드는 Synology NAS의 Docker를 사용하여 포트폴리오 사이트를 배포하는 방법을 설명합니다.

## 사전 준비

1. Synology NAS에 Docker 패키지가 설치되어 있어야 합니다.
2. SSH 접속이 가능해야 합니다 (또는 File Station을 통해 파일 업로드).

## 방법 1: Docker Compose 사용 (권장)

### 1단계: 파일 준비

프로젝트 폴더에 다음 파일들이 있는지 확인하세요:
- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf`
- `.dockerignore`

### 2단계: Synology NAS에 파일 업로드

1. File Station을 열거나 SSH로 접속합니다.
2. 프로젝트 전체 폴더를 NAS의 원하는 위치에 업로드합니다 (예: `/docker/portfolio-site`).

### 3단계: Docker Compose로 빌드 및 실행

#### SSH를 통한 방법:

```bash
# 프로젝트 폴더로 이동
cd /volume1/docker/portfolio-site  # 실제 경로에 맞게 수정

# Docker Compose로 빌드 및 실행
docker-compose up -d --build
```

#### Synology Docker GUI를 통한 방법:

1. Docker 패키지를 엽니다.
2. "프로젝트" 탭으로 이동합니다.
3. "생성" 버튼을 클릭합니다.
4. "프로젝트에서 생성"을 선택합니다.
5. 프로젝트 이름을 입력하고 (예: `portfolio-site`)
6. 경로를 선택합니다 (프로젝트 폴더가 있는 위치).
7. `docker-compose.yml` 파일을 선택합니다.
8. "생성" 버튼을 클릭합니다.

### 4단계: 포트 확인 및 접속

- 기본 포트: `30080` (보안을 위해 변경됨)
- 브라우저에서 `http://your-nas-ip:30080`으로 접속합니다.

포트를 변경하려면 `docker-compose.yml`의 `ports` 섹션을 수정하세요:
```yaml
ports:
  - "원하는포트:80"
```

## 방법 2: Docker 명령어 직접 사용

### 1단계: 이미지 빌드

```bash
cd /volume1/docker/portfolio-site
docker build -t portfolio-site .
```

### 2단계: 컨테이너 실행

```bash
docker run -d \
  --name portfolio-site \
  --restart unless-stopped \
  -p 8080:80 \
  portfolio-site
```

## 컨테이너 관리

### 컨테이너 중지
```bash
docker-compose down
# 또는
docker stop portfolio-site
```

### 컨테이너 시작
```bash
docker-compose up -d
# 또는
docker start portfolio-site
```

### 컨테이너 재시작
```bash
docker-compose restart
# 또는
docker restart portfolio-site
```

### 로그 확인
```bash
docker-compose logs -f
# 또는
docker logs -f portfolio-site
```

### 이미지 재빌드 (코드 변경 후)
```bash
docker-compose up -d --build
# 또는
docker build -t portfolio-site . && docker restart portfolio-site
```

## 업데이트 방법

코드를 수정한 후:

1. 변경된 파일을 NAS에 업로드합니다.
2. 다음 명령어로 재빌드 및 재시작합니다:
```bash
docker-compose up -d --build
```

## 문제 해결

### 포트가 이미 사용 중인 경우
`docker-compose.yml`에서 포트를 변경하세요:
```yaml
ports:
  - "8081:80"  # 다른 포트 사용
```

### 빌드 오류 발생 시
```bash
# 캐시 없이 재빌드
docker-compose build --no-cache
docker-compose up -d
```

### 컨테이너 로그 확인
```bash
docker logs portfolio-site
```

## 보안 설정 (선택사항)

### 역방향 프록시 설정 (Synology Reverse Proxy)

1. 제어판 > 로그인 포털 > 고급 > 역방향 프록시로 이동
2. "생성" 클릭
3. 설정:
   - 소스: 호스트 이름: `portfolio.yourdomain.com`, 포트: `443` (HTTPS)
   - 대상: 호스트 이름: `localhost`, 포트: `8080`
4. SSL 인증서 설정 (Let's Encrypt 권장)

## 참고사항

- 기본적으로 컨테이너는 재시작 시 자동으로 시작됩니다 (`restart: unless-stopped`).
- 로그는 `./logs` 폴더에 저장됩니다 (볼륨 마운트 시).
- 정적 파일은 1년간 캐싱됩니다.
