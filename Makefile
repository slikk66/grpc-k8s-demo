THIS_FILE := $(lastword $(MAKEFILE_LIST))
ENV ?= demo
REGION ?= us-east-2
RECORD ?= grpc

# build documentation
.PHONY: docs
docs: refresh-docs-image
	rm -f "${PWD}/"*.pdf || true
	docker run --rm -v "${PWD}:/data" -v "${PWD}/docs/source:/docs/source" k8s-demo-docs /bin/bash -c "sphinx-build -b rinoh source _build/rinoh && cp _build/rinoh/*.pdf /data"
	@echo "\n\n======================="
	@echo "PDF generation complete - please open the PDF file in the root of the repository"

# initialize pulumi stacks
.PHONY: pulumi-init
pulumi-init:
	cd "${PWD}/pulumi/grpc-vpc" && pulumi stack init ${ENV} && pulumi config set aws:region ${REGION}
	cd "${PWD}/pulumi/grpc-cluster" && pulumi stack init ${ENV} && pulumi config set aws:region ${REGION}
	cd "${PWD}/pulumi/grpc-workload" && pulumi stack init ${ENV} && pulumi config set aws:region ${REGION}
	cd "${PWD}/pulumi/grpc-record" && pulumi stack init ${ENV} && pulumi config set aws:region ${REGION}

# do initial infra deployment
.PHONY: init-infrastructure
init-infrastructure:
	cd "${PWD}/pulumi/grpc-vpc" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi up -y
	cd "${PWD}/pulumi/grpc-cluster" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi up -y

# do version release
.PHONY: release
release:
	cd "${PWD}/pulumi/grpc-workload" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi up -y

# teardown everything
.PHONY: teardown
teardown:
	cd "${PWD}/pulumi/grpc-record" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi destroy -y && pulumi stack rm ${ENV} -y
	cd "${PWD}/pulumi/grpc-workload" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi destroy -y && pulumi stack rm ${ENV} -y
	cd "${PWD}/pulumi/grpc-cluster" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi destroy -y && pulumi stack rm ${ENV} -y
	cd "${PWD}/pulumi/grpc-vpc" && pulumi stack select ${ENV} && pulumi refresh -y && pulumi destroy -y && pulumi stack rm ${ENV} -y

# jump into kubectl session
.PHONY: get-kubectl
get-kubectl:
	@cd "${PWD}/pulumi/grpc-cluster" && pulumi stack select ${ENV} && pulumi stack output kubeconfig > "${PWD}/${REGION}-${ENV}-kubeconfig.json"
	export KUBECONFIG="${PWD}/${REGION}-${ENV}-kubeconfig.json"

# show NLB endpoint
.PHONY: show-endpoint
show-endpoint:
	@cd "${PWD}/pulumi/grpc-workload" && pulumi stack select ${ENV} && pulumi stack output url

# set NLB endpoint in R53
.PHONY: set-endpoint
set-endpoint:
	cd "${PWD}/pulumi/grpc-record" && pulumi stack select ${ENV} && pulumi refresh -y && RECORD=${RECORD} pulumi up -y

# refresh all npm considerations
.PHONY: refresh-npm
refresh-npm:
	rm -rf "${PWD}/pulumi/node_modules"
	cd "${PWD}/pulumi" && npm install

# generate tls certificate for a given domain using certbot + AWS and place them in correct location for deployment
.PHONY: generate-tls
generate-tls:
	rm -rf "${PWD}/temp-certs/"
	mkdir "${PWD}/temp-certs" || true
	mkdir -p "${PWD}/pulumi/grpc-workload/temp-certs" || true
	docker run --rm -it \
		-e AWS_PROFILE \
		-e AWS_ACCESS_KEY_ID \
		-e AWS_SESSION_TOKEN \
		-e AWS_SECRET_ACCESS_KEY \
		-v "${HOME}/.aws":/root/.aws \
		-v "${PWD}/temp-certs":/etc/letsencrypt \
		certbot/dns-route53 \
		certonly --dns-route53 --non-interactive --agree-tos --email admin@${DOMAIN} -d ${DOMAIN} -d '*.${DOMAIN}'
	cp -f "${PWD}/temp-certs/live/${DOMAIN}/"* "${PWD}/pulumi/grpc-workload/temp-certs"

# helper functions do not call directly
.PHONY: refresh-docs-image
refresh-docs-image:
	docker rmi k8s-demo-docs --force || true
	docker build . -f "${PWD}/Dockerfile.docs" -t k8s-demo-docs
