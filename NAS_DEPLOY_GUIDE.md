# Synology NAS 배포 실전 가이드

이 가이드는 Synology NAS에 포트폴리오 사이트를 실제로 배포하는 단계별 가이드입니다.

## 📋 사전 준비사항

1. ✅ Synology NAS가 네트워크에 연결되어 있어야 합니다
2. ✅ Docker 패키지가 설치되어 있어야 합니다
3. ✅ SSH 접속이 활성화되어 있어야 합니다 (또는 File Station 사용 가능)
4. ✅ NAS의 IP 주소를 알고 있어야 합니다

## 🔧 1단계: Docker 패키지 설치 확인

### Synology DSM에서 확인:

1. **패키지 센터** 열기
2. **Docker** 검색
3. 설치되어 있지 않다면 **설치** 클릭
4. 설치 완료 후 **열기** 클릭

## 📁 2단계: 프로젝트 폴더 준비

### 로컬 컴퓨터에서:

1. 프로젝트 폴더 전체를 압축합니다 (ZIP 파일)
   - `Dockerfile`, `docker-compose.yml`, `nginx.conf` 등 모든 파일 포함
   - `node_modules`는 제외해도 됩니다 (Docker에서 재설치)

### 또는 Git 사용 (권장):

```bash
# Git 저장소에 푸시 (GitHub, GitLab 등)
git add .
git commit -m "Ready for deployment"
git push
```

## 🚀 3단계: NAS에 파일 업로드

### 방법 A: File Station 사용 (GUI)

1. **File Station** 열기
2. 원하는 위치에 폴더 생성 (예: `docker` 폴더)
3. `portfolio-site` 폴더 생성
4. 프로젝트 파일들을 모두 업로드:
   - `Dockerfile`
   - `docker-compose.yml`
   - `nginx.conf`
   - `.dockerignore`
   - `package.json`
   - `package-lock.json` (있다면)
   - `vite.config.ts`
   - `tsconfig.json`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `index.html`
   - `src/` 폴더 전체
   - `public/` 폴더 (있다면)

**경로 예시**: `/volume1/docker/portfolio-site`

### 방법 B: SSH 사용 (터미널)

```bash
# 로컬 컴퓨터에서 실행
# SCP를 사용하여 파일 전송
scp -r "D:\대학원준비\PORTFOLIO SITE" admin@your-nas-ip:/volume1/docker/

# 또는 rsync 사용 (더 효율적)
rsync -avz --exclude 'node_modules' --exclude '.git' \
  "D:\대학원준비\PORTFOLIO SITE/" \
  admin@your-nas-ip:/volume1/docker/portfolio-site/
```

### 방법 C: Git Clone (SSH)

```bash
# NAS에 SSH 접속
ssh admin@your-nas-ip

# 프로젝트 폴더로 이동
cd /volume1/docker

# Git 저장소 클론
git clone your-repository-url portfolio-site
cd portfolio-site
```

## 🐳 4단계: Docker로 빌드 및 실행

### 방법 A: Docker GUI 사용 (초보자용)

1. **Docker** 패키지 열기
2. 왼쪽 메뉴에서 **프로젝트** 클릭
3. **생성** 버튼 클릭
4. **프로젝트에서 생성** 선택
5. 설정 입력:
   - **프로젝트 이름**: `portfolio-site`
   - **경로**: `/volume1/docker/portfolio-site` (실제 경로)
   - **프로젝트 파일**: `docker-compose.yml` 선택
6. **생성** 클릭
7. 빌드 및 실행이 자동으로 시작됩니다

### 방법 B: SSH 터미널 사용 (고급)

```bash
# NAS에 SSH 접속
ssh admin@your-nas-ip

# 프로젝트 폴더로 이동
cd /volume1/docker/portfolio-site

# Docker Compose로 빌드 및 실행
sudo docker-compose up -d --build

# 또는 일반 Docker 명령어 사용
sudo docker build -t portfolio-site .
sudo docker run -d \
  --name portfolio-site \
  --restart unless-stopped \
  -p 30080:80 \
  portfolio-site
```

## ✅ 5단계: 배포 확인

1. **컨테이너 상태 확인**:
   - Docker GUI에서 **컨테이너** 탭 확인
   - `portfolio-site` 컨테이너가 **실행 중** 상태인지 확인

2. **웹 브라우저에서 접속**:
   ```
   http://your-nas-ip:30080
   ```
   예: `http://192.168.1.100:30080`

3. **로그 확인** (문제 발생 시):
   ```bash
   sudo docker logs portfolio-site
   ```

## 🔒 6단계: 보안 설정 (중요!)

### 포트 변경 (이미 완료)

현재 포트: **30080** (docker-compose.yml에서 설정됨)

추가로 변경하려면:
1. `docker-compose.yml` 파일 수정
2. `ports: - "원하는포트:80"` 변경
3. 컨테이너 재시작

### 방화벽 설정

1. **제어판** > **보안** > **방화벽** 열기
2. **방화벽 프로필 편집** 클릭
3. **포트 허용 규칙** 추가:
   - 포트: `30080`
   - 프로토콜: `TCP`
   - 소스 IP: 필요시 제한 (예: 로컬 네트워크만)

### 역방향 프록시 설정 (HTTPS, 도메인 사용 시)

1. **제어판** > **로그인 포털** > **고급** > **역방향 프록시**
2. **생성** 클릭
3. 설정:
   - **설명**: Portfolio Site
   - **소스**:
     - 프로토콜: `HTTPS`
     - 호스트 이름: `portfolio.yourdomain.com` (또는 원하는 도메인)
     - 포트: `443`
   - **대상**:
     - 프로토콜: `HTTP`
     - 호스트 이름: `localhost`
     - 포트: `30080`
4. **SSL 인증서** 설정 (Let's Encrypt 권장)

## 🔄 7단계: 업데이트 방법

코드를 수정한 후:

### 방법 A: Docker GUI

1. Docker > 프로젝트 > `portfolio-site` 선택
2. **재빌드** 클릭

### 방법 B: SSH

```bash
# NAS에 SSH 접속
ssh admin@your-nas-ip

# 프로젝트 폴더로 이동
cd /volume1/docker/portfolio-site

# 변경된 파일 업로드 (File Station 또는 Git pull)

# 재빌드 및 재시작
sudo docker-compose up -d --build
```

## 🛠️ 문제 해결

### 포트 충돌 오류

```bash
# 사용 중인 포트 확인
sudo netstat -tuln | grep 30080

# 다른 포트로 변경 (docker-compose.yml 수정 후)
sudo docker-compose down
sudo docker-compose up -d --build
```

### 빌드 실패

```bash
# 캐시 없이 재빌드
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### 컨테이너가 시작되지 않음

```bash
# 로그 확인
sudo docker logs portfolio-site

# 컨테이너 상태 확인
sudo docker ps -a
```

### 권한 문제

```bash
# Docker 그룹에 사용자 추가 (필요시)
sudo usermod -aG docker $USER
```

## 📝 체크리스트

배포 전 확인사항:

- [ ] Docker 패키지 설치됨
- [ ] 프로젝트 파일이 NAS에 업로드됨
- [ ] `docker-compose.yml` 포트가 30080으로 설정됨
- [ ] 방화벽에서 포트 30080 허용됨
- [ ] 컨테이너가 정상 실행 중
- [ ] 웹 브라우저에서 접속 가능
- [ ] 자동 재시작 설정 확인 (`restart: unless-stopped`)

## 🔗 유용한 명령어

```bash
# 컨테이너 중지
sudo docker-compose down

# 컨테이너 시작
sudo docker-compose up -d

# 컨테이너 재시작
sudo docker-compose restart

# 로그 실시간 확인
sudo docker-compose logs -f

# 컨테이너 삭제 (주의!)
sudo docker-compose down -v

# 이미지 삭제
sudo docker rmi portfolio-site
```

## 📞 추가 도움말

- Synology Docker 공식 문서: https://kb.synology.com/ko-kr/DSM/help/Docker/docker_desc
- Docker Compose 문서: https://docs.docker.com/compose/
