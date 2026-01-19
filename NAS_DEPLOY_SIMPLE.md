# Synology NAS 배포 - 초보자용 가이드

이 가이드는 터미널 명령어 없이 Synology NAS의 GUI만으로 배포하는 방법입니다.

## 📋 준비사항

1. Synology NAS가 네트워크에 연결되어 있음
2. Docker 패키지 설치됨
3. File Station 사용 가능

## 🚀 배포 방법 (GUI만 사용)

### 1단계: 프로젝트 파일 준비

로컬 컴퓨터에서:
1. 프로젝트 폴더 전체를 ZIP으로 압축
2. 또는 File Station으로 직접 업로드

### 2단계: NAS에 파일 업로드

1. **Synology DSM** 웹 인터페이스 접속
   - 브라우저에서 `http://your-nas-ip:5000` 접속
   - 예: `http://192.168.1.100:5000`

2. **File Station** 열기
   - 메인 메뉴에서 "File Station" 클릭

3. **폴더 생성**
   - 왼쪽에서 원하는 위치 선택 (예: `docker` 폴더)
   - 상단 "생성" 버튼 → "폴더" 클릭
   - 폴더 이름: `portfolio-site`
   - "확인" 클릭

4. **파일 업로드**
   - `portfolio-site` 폴더 열기
   - 상단 "업로드" 버튼 클릭
   - "파일 선택" 클릭
   - 다음 파일들을 모두 선택하여 업로드:
     - `Dockerfile`
     - `docker-compose.yml`
     - `nginx.conf`
     - `.dockerignore`
     - `package.json`
     - `package-lock.json` (있다면)
     - `vite.config.ts`
     - `tsconfig.json`
     - `tsconfig.node.json`
     - `tailwind.config.js`
     - `postcss.config.js`
     - `index.html`
     - `src/` 폴더 전체 (폴더를 드래그 앤 드롭)
     - `public/` 폴더 (있다면)

   **팁**: `src` 폴더는 폴더 전체를 드래그 앤 드롭하거나, "폴더 업로드"를 사용하세요.

### 3단계: Docker로 배포

1. **Docker 패키지 열기**
   - 메인 메뉴에서 "Docker" 클릭
   - 설치되어 있지 않다면 "패키지 센터"에서 설치

2. **프로젝트 생성**
   - 왼쪽 메뉴에서 **"프로젝트"** 탭 클릭
   - 상단 **"생성"** 버튼 클릭
   - **"프로젝트에서 생성"** 선택
   - 다음 정보 입력:
     - **프로젝트 이름**: `portfolio-site`
     - **경로**: `/volume1/docker/portfolio-site` 
       - 또는 File Station에서 `portfolio-site` 폴더 우클릭 → "속성" → 경로 복사
     - **프로젝트 파일**: `docker-compose.yml` 선택
   - **"생성"** 버튼 클릭

3. **빌드 및 실행**
   - 프로젝트가 생성되면 자동으로 빌드가 시작됩니다
   - 빌드 완료까지 몇 분 소요될 수 있습니다
   - 상태가 "실행 중"으로 변경되면 완료입니다

### 4단계: 접속 확인

1. **컨테이너 확인**
   - Docker → "컨테이너" 탭
   - `portfolio-site` 컨테이너가 "실행 중"인지 확인

2. **웹 브라우저에서 접속**
   - 브라우저 주소창에 입력:
   ```
   http://your-nas-ip:30080
   ```
   - 예: `http://192.168.1.100:30080`
   - 포트폴리오 사이트가 표시되면 성공!

## 🔧 문제 해결

### 파일이 업로드되지 않을 때

1. File Station에서 폴더 권한 확인
2. "속성" → "권한"에서 읽기/쓰기 권한 확인
3. 필요시 관리자 권한으로 다시 업로드

### Docker 프로젝트 생성 실패

1. File Station에서 `docker-compose.yml` 파일이 있는지 확인
2. 파일 경로가 정확한지 확인
3. Docker 패키지가 최신 버전인지 확인

### 빌드 실패

1. Docker → "이미지" 탭에서 빌드 로그 확인
2. File Station에서 모든 필수 파일이 업로드되었는지 확인:
   - `Dockerfile` (대소문자 주의)
   - `docker-compose.yml`
   - `nginx.conf`
   - `package.json`
   - `src/` 폴더

### 접속이 안 될 때

1. Docker → "컨테이너" 탭에서 컨테이너 상태 확인
2. "로그" 버튼 클릭하여 오류 메시지 확인
3. 제어판 → 보안 → 방화벽에서 포트 30080 허용 확인

## 📝 체크리스트

배포 전 확인:

- [ ] Docker 패키지 설치됨
- [ ] File Station에서 `portfolio-site` 폴더 생성됨
- [ ] 모든 파일이 업로드됨 (특히 `Dockerfile`, `docker-compose.yml`, `src/` 폴더)
- [ ] Docker 프로젝트 생성 완료
- [ ] 컨테이너가 "실행 중" 상태
- [ ] 브라우저에서 `http://nas-ip:30080` 접속 가능

## 💡 참고사항

- **SSH 접속이란?**: 터미널(명령어 창)을 통해 NAS에 접속하는 방법입니다. 이 가이드에서는 필요 없습니다.
- **포트 30080**: 보안을 위해 기본 포트 대신 사용하는 포트입니다.
- **자동 재시작**: NAS가 재부팅되어도 컨테이너가 자동으로 시작됩니다.

## 🔄 업데이트 방법

코드를 수정한 후:

1. File Station에서 수정된 파일 업로드
2. Docker → 프로젝트 → `portfolio-site` 선택
3. "재빌드" 버튼 클릭
4. 완료될 때까지 대기
