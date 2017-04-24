Сервис Jungo
============
Описание задания.

Сервис Jungo получает в POST запросе тело файла или JSON запрос с набором URL (см. пример) и передает содержимое файла или в случае передачи URL - тело файла по заданному URL сервису Bulb (http://88.99.174.234:9090 POST multipart/form-data параметр file), который в ответе выдает строку, сервис Jungo для каждого переданного файла (в теле или по ссылке) рассчитывает хэш вида hash = sha1(sha1(тело файла) + ответ bulb) и возвращает ответ в виде JSON.

Пример JSON запроса 
```js
[
    "http://example.com/file1.txt",
    "http://example.com/file2.txt",
    "http://example.com/file3.txt"
]
```
Пример ответа сервиса Bulb

NyLOk1jzfXI1YvK3gzMgRlXlNTczGN96G7Q/jMkFAsM

Пример ответа сервиса Jungo

При передаче файла в теле запроса:
```js
[
    "NyLOk1jzfXI1YvK3gzMgRlXlNTczGN96G7Q/jMkFAsM"
]
```

При передаче JSON запроса:
```js
[
    "NyLOk1jzfXI1YvK3gzMgRlXlNTczGN96G7Q/jMkFAsM",
    "NyLOk1jzfXI1YvK3gzMgRlXlNTczGN96G7Q/jMkFAsM",
    "NyLOk1jzfXI1YvK3gzMgRlXlNTczGN96G7Q/jMkFAsM"
]
```
Требования к сервису:

1.В ответ добавляется заголовок X-RESPONSE-TIME - с общим временем подготовки ответа в ms
2.Если один или несколько файлов недоступны - возвращается ошибка 404
3.Если один или несколько файлов не удается загрузить в течение 10 сек - возвращается ошибка 504
4.Если сервис Bulb не отвечает в течение 5 сек - возвращается ошибка 504


## 1.Установка

Для установки необходимо
Клонировать репозиторий
```
git clone https://github.com/diselop/8log
```
Установить зависимости
```
npm install
```
или
```
yarn 
```
Переименовать файл 

```
settings.json.example в settings.json
```
Указать параметры в конфигурационном файле

где "dirname" - имя директории/сервера в которох будут храниться файлы
Для запуска проекта в dev режиме
```
npm run dev
```
И соответственно production
```
npm run start
```

## 2.Описание работы  API
Отправка файла Bulb.
Используется метод POST, с обязательным заголовком "Content-Type: multipart/form-data"  расположенному по адресу %host%/bulb, где %host% - адрес сайта(и порта) 
на  котором расположен сервер.
Пример запроса
```sh
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@1.jpg" http://localhost:3000/bulb
```
Результат ответа
```js
HTTP/1.1 200 OK
X-Powered-By: Express
X-RESPONSE-TIME: 425
Content-Type: application/json; charset=utf-8
Content-Length: 51
ETag: W/"33-VQ54c5Rhh30iCCtJ3OGeEgwhCzM"
Date: Mon, 24 Apr 2017 21:31:11 GMT
Connection: keep-alive

{
   "data":"1f70f78c4c5c294a12ceed9b38885c93f63fa349"
}
```
Отправка файла jungo.
Используется метод POST, с обязательным заголовком "Accept:application/json" и "Content-Type:application/json"  расположенному по адресу %host%/jungo, где %host% - адрес сайта(и порта) 
на  котором расположен сервер.
Пример запроса
```sh
curl -i -H "Accept:application/json" -H "Content-Type:application/json" -XPOST "http://localhost:3000/jungo" -d '["http://i.ytimg.com/vi/BpkQ4tCokG0/mqdefault.jpg","http://www.coolest-gadgets.com/wp-content/uploads/tube-transport-300x238.jpg"]'
```
Результат ответа
```js
HTTP/1.1 200 OK
X-Powered-By: Express
X-RESPONSE-TIME: 1
Content-Type: application/json; charset=utf-8
Content-Length: 87
ETag: W/"57-UeAGKd+PqaOx1ZRh+Pnre9a+pJY"
Date: Mon, 24 Apr 2017 21:30:41 GMT
Connection: keep-alive

["143e833039739c560891e70ac76c8df07c37fe03","59f07b01ccd9007975ec6349e498e9c4d4afd443"]
```