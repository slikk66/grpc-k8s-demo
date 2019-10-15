THIS_FILE := $(lastword $(MAKEFILE_LIST))

# refresh all npm considerations
.PHONY: refresh-npm
refresh-npm:
	rm -rf ${PWD}/pulumi/node_modules
	cd ${PWD}/pulumi && npm install

# generate tls certificate for a given domain using certbot + AWS and place them in correct location for deployment
.PHONY: generate-tls
generate-tls:
	mkdir ${PWD}/temp-certs || true
	mkdir -p ${PWD}/pulumi/grpc-workload/temp-certs || true
	rm -rf ${PWD}/temp-certs/*
	docker run --rm -it -e AWS_PROFILE -v ${HOME}/.aws:/root/.aws -v ${PWD}/temp-certs:/etc/letsencrypt certbot/dns-route53 certonly --dns-route53 --non-interactive --agree-tos --email admin@${DOMAIN} -d ${DOMAIN} -d '*.${DOMAIN}'
	cp -f ${PWD}/temp-certs/live/${DOMAIN}/* ${PWD}/pulumi/grpc-workload/temp-certs
