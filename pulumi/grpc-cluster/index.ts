import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";

// pull environment from stack name
const env = pulumi.getStack();

// load outputs from VPC stack matching same environment
const vpc = new pulumi.StackReference(`/grpc-vpc/${env}`);

// create the EKS cluster using pulumi/eks
// https://github.com/pulumi/pulumi-eks/blob/master/nodejs/eks/cluster.ts
let cluster = new eks.Cluster("grpc", {
    vpcId: vpc.getOutput('id'),
    subnetIds: vpc.getOutput(`combined_subnet_ids`),
    minSize: 2,
    maxSize: 2,
    deployDashboard: false,
    nodeAssociatePublicIpAddress: false,
    instanceType: 't3.small'
});

// grab the kubeconfig & provider as outputs
export const kubeconfig = cluster.kubeconfig;
