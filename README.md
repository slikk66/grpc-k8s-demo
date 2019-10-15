# grpc_k8s

- This project will not work on Windows.  You can use WSL if needed.
- Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html
- Install Pulumi: `curl -sSL https://get.pulumi.com | sh`
- Install NPM: https://www.npmjs.com/get-npm
- Install required Node Packages: npm install
- Install eks iam authenticator: See https://github.com/pulumi/eks#installing

- add the ACM ARN to config
- run the eks up
- export the kubeconfig

pulumi stack output kubeconfig > kubeconfig.json
export KUBECONFIG=$PWD/kubeconfig.json

- run the ecr up
- build the docker
