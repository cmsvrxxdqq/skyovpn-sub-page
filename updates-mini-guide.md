# SkyoVPN Subscription Page

Кастомный форк [remnawave/subscription-page](https://github.com/remnawave/subscription-page) с liquid-glass дизайном для SkyoVPN. Бэкенд — панель Remnawave.

- Репозиторий исходников: `https://github.com/cmsvrxxdqq/skyovpn-sub-page`
- Docker Hub образ: `sexisdeath/skyovpn-sub-page:latest`
- Прод сервер: `/opt/remnawave/subscription_new/` за Caddy

---

## Как работает деплой (важно понять)

Сервер **не билдит** ничего. На сервере просто `docker compose pull` готового образа с Docker Hub. Значит при любом изменении кода:

1. Меняешь файлы локально (на Windows)
2. Билдишь фронт локально → собирает `frontend/dist/`
3. Билдишь Docker-образ локально → запекает фронт + бэк в один image
4. Пушишь образ в Docker Hub
5. На сервере: `docker compose pull && docker compose up -d`

GitHub-пуш — **только бэкап исходников**, на деплой не влияет.

---

## Быстрое обновление (от А до Я)

### Часть 1. Локально (Windows, Git Bash)

```bash
# 1. В проект
cd ~/Desktop/skyovpn-sub-page

# 2. Внеси изменения (например, замени favicon в frontend/public/assets/)

# 3. Собери фронт (через npx — обходит сломанный на Windows npm-скрипт)
cd frontend
npx vite build
cd ..

# 4. Собери Docker-образ + запушь в Docker Hub одной командой
docker buildx build --platform linux/amd64 -t sexisdeath/skyovpn-sub-page:latest --push .
```

> Перед первым `docker buildx ... --push`: убедись что сделал `docker login` (логин — `sexisdeath`, пароль — Docker Hub access token из https://hub.docker.com/settings/security).

### Часть 2. На сервере (SSH)

```bash
ssh root@v3098780
cd /opt/remnawave/subscription_new

docker compose pull
docker compose up -d

# КРИТИЧНО: подключить контейнер к сети Caddy
# (не нужно если применил «Постоянный фикс compose-файла» ниже)
docker network connect remnawave-network remnawave-subscription-page

docker compose logs -f
# Ctrl+C когда увидишь "Nest application successfully started"
```

### Часть 3. Проверка

```bash
# Caddy достаёт контейнер?
docker exec caddy wget -qO- http://remnawave-subscription-page:3010/ | head -3
# должно выехать <!doctype html>...

# Фавикон новый?
curl -I https://sub.skyo.wtf/assets/favicon.svg
```

Открой `https://sub.skyo.wtf/<любой-shortUuid>` с **Ctrl+Shift+R** (hard reload, чтобы убить кеш фавикона).

### Часть 4. (Опционально) бэкап в GitHub

```bash
cd ~/Desktop/skyovpn-sub-page
git add frontend/public/assets/   # или что менял
git commit -m "Update favicon to SkyoVPN branding"
git push origin main
```

---

## Постоянный фикс compose-файла (сделать один раз)

Чтобы больше **не приходилось вручную** вызывать `docker network connect` после каждого `up -d`.

Текущий `docker-compose.yml` имеет связку `driver: bridge` + `external: true`, из-за которой Compose создаёт **левую** сеть `subscription_new_remnawave-network` вместо подключения к настоящей `remnawave-network` (где сидит Caddy). Поэтому Caddy не резолвит апстрим → 502.

### Шаги

```bash
ssh root@v3098780
nano /opt/remnawave/subscription_new/docker-compose.yml
```

Поменяй блок внизу с:
```yaml
networks:
    remnawave-network:
        driver: bridge
        external: true
```
На:
```yaml
networks:
    remnawave-network:
        name: remnawave-network
        external: true
```

Сохрани (Ctrl+O, Enter, Ctrl+X), и пересоздай:
```bash
cd /opt/remnawave/subscription_new
docker compose down
docker compose up -d
```

Проверь что в сети теперь оба:
```bash
docker network inspect remnawave-network --format '{{range .Containers}}{{.Name}} -> {{.IPv4Address}}{{"\n"}}{{end}}'
```

Должно вернуть:
```
caddy -> 172.19.0.X/16
remnawave-subscription-page -> 172.19.0.X/16
```

После этого `docker network connect` руками **не нужен** — Compose сам цепляет к правильной сети.

---

## Замена фавикона (конкретный кейс)

Файлы — в [frontend/public/assets/](frontend/public/assets/). Имена не меняй (они прописаны в [frontend/index.html](frontend/index.html)):

| Файл | Назначение |
|------|------------|
| `favicon.svg` | основной (современные браузеры) |
| `favicon-16x16.png` | мелкий |
| `favicon-32x32.png` | таб браузера |
| `favicon-180x180.png` | iOS home screen |

Опционально (для манифестов): `favicon-48x48.png`, `favicon-64x64.png`, `favicon-128x128.png`, `favicon-192x192.png`, `favicon-512x512.png`.

Удобно сгенерировать всё из одного исходника на [realfavicongenerator.net](https://realfavicongenerator.net/) и подменить файлы.

После подмены — обычный цикл «Часть 1 → 2 → 3» сверху.

---

## Локальная dev-проверка (опционально)

Перед билдом образа можно посмотреть результат в браузере:

```bash
cd frontend
npm run start:dev      # http://localhost:3334
```

Hard reload (Ctrl+Shift+R) — глянь фавикон в табе.

---

## Траблшутинг

### `502 Bad Gateway` на сайте после обновления

Симптом: контейнер живой (логи: `Nest application successfully started`), но `https://sub.skyo.wtf/...` возвращает 502.

**Диагностика:**
```bash
docker logs caddy --tail=50 | grep -iE "error|dial|lookup"
docker network inspect remnawave-network --format '{{range .Containers}}{{.Name}}{{"\n"}}{{end}}'
```

Если в Caddy логах `dial tcp: lookup remnawave-subscription-page ... server misbehaving` или в network inspect нет `remnawave-subscription-page` — это та самая проблема с сетью.

**Фикс:**
```bash
docker network connect remnawave-network remnawave-subscription-page
```

И сразу примени [«Постоянный фикс compose-файла»](#постоянный-фикс-compose-файла-сделать-один-раз) — больше не повторится.

### `npm run start:build` падает на Windows

Ошибка: `"NODE_ENV" не является внутренней или внешней командой`.

Скрипт `"NODE_ENV=production tsc && vite build"` — unix-синтаксис, cmd.exe (через который npm на винде запускает скрипты) его не понимает.

**Workaround** (без правок кода):
```bash
cd frontend
npx vite build
```

Vite сам выставляет `NODE_ENV=production` при `vite build`, плюс пропускается лишний `tsc`-typecheck.

### `docker buildx build` падает с `connecting to 127.0.0.1:10801: connectex`

Docker Desktop пытается ходить через прокси (Clash / V2Ray), которого сейчас нет.

**Фикс:** Docker Desktop → Settings → Resources → Proxies → **No proxy** → Apply & Restart. Либо включи свой прокси-клиент.

Проверка:
```bash
docker info | grep -i proxy
```

### `unauthorized: requested access to the resource is denied` при `docker push`

Не залогинен в Docker Hub:
```bash
docker login
# username: sexisdeath
# password: <Docker Hub access token>
```

Токен — в https://hub.docker.com/settings/security → New Access Token → Read & Write.

### Логи: `docker-entrypoint.sh: line 2: : not found`

Косметический баг — файл сохранён с CRLF (Windows-style), shell на Linux спотыкается о `\r` на пустых строках. На работу **не влияет** (важные строки `export` и `exec` отрабатывают).

Фикс — добавить в репо `.gitattributes`:
```
*.sh text eol=lf
```
И пересохранить файл (`git rm --cached backend/docker-entrypoint.sh && git add backend/docker-entrypoint.sh && git commit`).

### Фавикон не обновился в браузере

- **Ctrl+Shift+R** (hard reload, чистит кеш)
- Открой напрямую `https://sub.skyo.wtf/assets/favicon.svg` — если там старый, значит образ ещё не обновился на сервере
- Проверь `docker compose ps` на сервере — `CREATED` должен быть свежий
- Проверь что внутри контейнера новый файл:
  ```bash
  docker exec remnawave-subscription-page head -3 frontend/assets/favicon.svg
  ```

### Откат на предыдущую версию

Если новый билд сломал прод и надо срочно вернуть:

```bash
# Если Docker Hub хранит предыдущий tag (по умолчанию только latest — смотри в Hub)
docker pull sexisdeath/skyovpn-sub-page:<previous-tag>
docker tag sexisdeath/skyovpn-sub-page:<previous-tag> sexisdeath/skyovpn-sub-page:latest
docker compose up -d
```

Лучше на будущее — **тегать релизы**:
```bash
# при сборке
docker buildx build --platform linux/amd64 \
  -t sexisdeath/skyovpn-sub-page:latest \
  -t sexisdeath/skyovpn-sub-page:v$(date +%Y%m%d-%H%M) \
  --push .
```

Так в Docker Hub будет история версий и можно откатываться по тегу.

---

## Структура проекта (для справки)

```
.
├── Dockerfile                      бекенд + копирование собранного фронта
├── docker-compose.yml              локальная разработка (если нужна)
├── docker-compose-prod.yml         билд из исходников (НЕ используется на проде)
├── .env.sample                     шаблон env-переменных
├── backend/                        NestJS, Node 24-alpine
│   └── docker-entrypoint.sh
└── frontend/
    ├── public/assets/              фавикон + статические ассеты
    ├── src/                        React + Mantine + Vite
    ├── index.html                  <link rel="icon"> прописан тут
    └── dist/                       результат vite build (gitignored)
```

> Прод-инсталляция использует именно Docker Hub образ `sexisdeath/skyovpn-sub-page:latest`. `docker-compose-prod.yml` (с `build:`) — артефакт раннего деплоя, сейчас на сервере не используется.

---

## Памятка: первая установка с нуля

> На случай переезда. Если уже всё стоит — пропускай.

```bash
# Предусловия: Caddy уже стоит, remnawave-network существует, панель Remnawave работает
mkdir -p /opt/remnawave/subscription_new && cd /opt/remnawave/subscription_new

# 1. docker-compose.yml (с правильным network-блоком сразу!)
cat > docker-compose.yml <<'EOF'
services:
    remnawave-subscription-page:
        image: sexisdeath/skyovpn-sub-page:latest
        container_name: remnawave-subscription-page
        hostname: remnawave-subscription-page
        restart: always
        env_file:
            - .env
        ports:
            - '127.0.0.1:3010:3010'
        networks:
            - remnawave-network

networks:
    remnawave-network:
        name: remnawave-network
        external: true
EOF

# 2. .env
cat > .env <<EOF
APP_PORT=3010
REMNAWAVE_PANEL_URL=http://remnawave:3000
REMNAWAVE_API_TOKEN=<токен из Dashboard → Settings → API Tokens>
EOF

# 3. Поднять
docker compose up -d && docker compose logs -f
```

В Caddyfile (`/opt/remnawave/caddy/Caddyfile`) должен быть блок:
```caddy
https://sub.skyo.wtf {
    reverse_proxy * http://remnawave-subscription-page:3010
}
```

Если Caddy ещё не настроен — см. [официальный гайд Remnawave](https://docs.rw/docs/install/subscription-page/bundled).

---

## Жёсткие ограничения проекта (не трогать)

- `vite.config.ts` — не добавлять proxy, сломает `/assets/.app-config-v2.json`
- `root.layout.tsx` — не менять загрузку конфига
- `APP_CONFIG_ROUTE_LEADING_PATH` — не менять
- Структуры `brandingSettings`, `platforms`, `uiConfig` — не менять (сломает панель)

Подробнее в [.claude/CLAUDE.md](.claude/CLAUDE.md).
