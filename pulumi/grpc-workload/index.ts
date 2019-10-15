import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";
import { Base64 } from 'js-base64';
import * as fs from "fs";

// pull environment from stack name
const env = pulumi.getStack();

// get outputs from cluster
const cluster = new pulumi.StackReference(`/grpc-cluster/${env}`);

// convert the kubeconfig output into a string for provider consumption
const provider = new k8s.Provider("k8s", {
    kubeconfig: cluster.getOutput('kubeconfig').apply(JSON.stringify)
});

// common variables
const appName = `grpc-${env}`;
const appLabels = { appClass: appName };

// create configmap with nginx config
const nginxConfig = new k8s.core.v1.ConfigMap(`${appName}-configmap`, {
    metadata: { labels: appLabels },
    data: { "default.conf": fs.readFileSync("./nginx/default.conf").toString() },
}, { provider: provider });
const nginxConfigName = nginxConfig.metadata.apply(x => x.name);

// create tls secret from certificate
const tlsSecret = new k8s.core.v1.Secret(`${appName}-tls`, {
    metadata: { labels: appLabels },
    type: 'Opaque',
    data: {
        "nginx.crt": Base64.encode(fs.readFileSync("./temp-certs/fullchain.pem").toString()),
        "nginx.key": Base64.encode(fs.readFileSync("./temp-certs/privkey.pem").toString())
    },
}, { provider: provider });
const tlsSecretName = tlsSecret.metadata.apply(x => x.name);

// create the deployment for https://hub.docker.com/r/covrco/sre-grpc-exercise
const deployment = new k8s.apps.v1.Deployment(`${appName}-dep`, {
    metadata: { labels: appLabels },
    spec: {
        replicas: 2,
        selector: { matchLabels: appLabels },
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: `${appName}-server`,
                    image: "covrco/sre-grpc-exercise"
                }, {
                    name: `${appName}-nginx`,
                    image: "nginx:1.17",
                    ports: [{
                        name: "nginx-ingress",
                        containerPort: 443
                    }],
                    volumeMounts: [{
                        name: `${appName}-nginx-conf`,
                        mountPath: "/etc/nginx/conf.d"
                    },{
                        name: `${appName}-nginx-tls`,
                        mountPath: "/etc/nginx/ssl"
                    }]
                }],
                volumes: [{
                    name: `${appName}-nginx-conf`,
                    configMap: {
                        name: nginxConfigName
                    }
                }, {
                    name: `${appName}-nginx-tls`,
                    secret: {
                        secretName: tlsSecretName
                    }
                }]
            }
        }
    },
}, { provider: provider });

// create the NLB based service with ACM certificate
const service = new k8s.core.v1.Service(`${appName}-svc`, {
    metadata: {
        labels: appLabels,
        annotations: {
            "service.beta.kubernetes.io/aws-load-balancer-type": "nlb"
        }
    },
    spec: {
        type: "LoadBalancer",
        ports: [{
            name: "nlb-ingress",
            port: 9001,
            targetPort: "nginx-ingress"
        }],
        selector: appLabels,
    },
}, { provider: provider });

// // Export the URL for the load balanced service.
export const url = service.status.loadBalancer.ingress[0].hostname;
