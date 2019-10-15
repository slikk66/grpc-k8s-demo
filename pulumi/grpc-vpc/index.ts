import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

// pull environment from stack name
const env = pulumi.getStack();

// simple vpc for cluster created by AWSx pre-defined secure VPN code
// https://github.com/pulumi/pulumi-awsx/blob/master/nodejs/awsx/ec2/vpc.ts

// NOTE: the "ignoreChanges" setting is applied to the vpc and subnet options.
// This is due to EKS adding tagging to the subnets and vpc resources to support
// EKS finding suitable resources, but due to state tracking of the VPC
// resource, these tags need to be marked as "ignored" to prevent subsequent
// refreshes to remove the needed EKS tags
let vpc = new awsx.ec2.Vpc(`k8s-vpc-${env}`, {
    subnets: [{
        type: 'public',
        ignoreChanges: [
            'tags'
        ]
    }, {
        type: 'private',
        ignoreChanges: [
            'tags'
        ]
    }]
}, {
    ignoreChanges: [
        'tags'
    ]
});

export const id = vpc.id;
export const combined_subnet_ids = vpc.privateSubnetIds.concat(vpc.publicSubnetIds);
