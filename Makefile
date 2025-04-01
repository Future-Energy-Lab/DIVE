setup:
	@echo "Setting up containers..."
	docker run -d -p 27017:27017 --name=mongo mongo:latest
	docker run -d -p 5672:5672 -p 15672:15672 --hostname rabbit --name rabbit rabbitmq:3-management

clean:
	@echo "Stopping and removing containers..."
	docker stop mongo rabbit
	docker rm mongo rabbit