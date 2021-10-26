# montecarlo-ms

Instalar Docker:
https://docs.docker.com/desktop/windows/install/

Buildear la imagen:
docker build -t modelado .

Correr la imagen:
docker run -dit --name modelado -p 8080:80 modelado

Desde el navegador, ir a:
http://localhost:8080/