import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// pull environment from stack name
const env = pulumi.getStack();

// load outputs from VPC stack matching same environment
const workload = new pulumi.StackReference(`/grpc-workload/${env}`);

if ( typeof(process.env['ZONE']) === 'undefined' ) {
    console.log("ZONE env var missing! Please add it with `ZONE=Z1R8UBAEXAMPLE make set-record`");
}
else {

    var zone = String(process.env['ZONE']);
    var record = String(process.env['RECORD']);

    new aws.route53.Record(record, {
        name: record,
        type: 'CNAME',
        records: [workload.getOutput('url')],
        ttl: 300,
        zoneId: zone
    });

}
