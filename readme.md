- docker build -t my-order-service-prod:latest -f .\docker\production\Dockerfile .

- docker run -it --name order-service -p 5003:5003 -v "$(pwd)/config:/home/node/app/config" my-order-service-prod:latest
