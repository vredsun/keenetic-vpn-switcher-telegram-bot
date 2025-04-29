Server for telegram bot for fast switch vpn policy

# ENV vars

- `ENV_TELEGRAM_BOT_TOKEN` - telegram bot token (see <https://core.telegram.org/bots/faq#how-do-i-create-a-bot>)

- `ENV_WHITE_USER_IDS=xxxx,yyyy,zzzzz` - list of telegram uid (by default bot will write your uid)

- `ENV_DEVICE_NAMES` - list of device (see <http://192.168.1.1/devicesList>)

- `ENV_HOST` - host of your router (e.g. `rci.my-cool-name.keenetic.link`)

- `ENV_USERNAME` - name of the user with api access

- `ENV_PASSWORD` - password of the user with api access

- `ENV_POLICY_NAME=Policy<\d+>` - name of vpn policy (default `Policy0`)

# Docker

<https://hub.docker.com/r/vokinda/vpn-bot/tags>

```bash
docker pull vokinda/vpn-bot

docker run -p 80:80 \
-e ENV_WHITE_USER_IDS=xxxxx,yyyyy \
-e ENV_DEVICE_NAMES=xxxxx,yyyyy \
-e ENV_TELEGRAM_BOT_TOKEN=xxxx:yyyyyyyy \
-e ENV_HOST=xxxxx.yyy.zzz \
-e ENV_USERNAME=xxxxx \
-e ENV_PASSWORD=xxxxx
vokinda/vpn-bot:latest 
```

# Helpfull links

- keenetic api description - [link](https://help.keenetic.com/hc/ru/categories/201757869)

- keenetic http access description - [link](https://help.keenetic.com/hc/ru/articles/11282223272092-%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5-%D0%BC%D0%B5%D1%82%D0%BE%D0%B4%D0%BE%D0%B2-API-%D0%BF%D0%BE%D1%81%D1%80%D0%B5%D0%B4%D1%81%D1%82%D0%B2%D0%BE%D0%BC-%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D0%B0-HTTP-Proxy)
