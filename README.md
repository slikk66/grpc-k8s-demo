# gRPC - k8s demo

This project will not work on Windows OS, use WSL if needed.

## Full documentation is available for project usage with the following steps:
- Install GNU Make - https://www.gnu.org/software/make/
- Install Docker - https://docs.docker.com/install/
- From root of this repo, run `make docs`
- Open the created documentation file in the root of this repo, `GrpcK8sDemo.pdf`

## Deployment TL/DR (after prereqs from the docs are met):
- Refresh NPM (first run only): `make refresh-npm`
- Init Pulumi stacks (first run only): `make pulumi-init`
- Init infrastructure (first run only): `make init-infrastructure`
- Generate TLS Certificates (as needed on changes): `DOMAIN=yourdomain.com make generate-tls`
- Release application (as needed on changes): `make release`
- Create public endpoint in R53 Zone (as needed on changes): `ZONE=ZYOURZONEID make set-endpoint`

## Screenshots of solution in action
- https://github.com/slikk66/grpc-k8s-demo/tree/master/docs/screenshots
