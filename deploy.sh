docker build -t ais777/multi-client:latest -t ais777/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t ais777/multi-server:latest -t ais777/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t ais777/multi-worker:latest -t ais777/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push ais777/multi-client:latest
docker push ais777/multi-server:latest
docker push ais777/multi-worker:latest
docker push ais777/multi-client:$SHA
docker push ais777/multi-server:$SHA
docker push ais777/multi-worker:$SHA
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=ais777/multi-server:$SHA 
kubectl set image deployments/client-deployment client=ais777/multi-client:$SHA 
kubectl set image deployments/worker-deployment worker=ais777/multi-worker:$SHA