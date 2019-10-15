Overview
=======================

Overview
-----------------------

This project is a solution for the Covr exercise repository located `here <https://github.com/covrco/candidate-exercises/tree/master/grpc_k8s/>`_.

This solution is not intended to be a production-ready "best practice" or "complete" solution.

The goal of this solution was to satisfy the requirements laid out in the exercise and to show
technical ability to quickly and accurately arrive at the solution.

Please see the :ref:`improvements` for a list of possible solution extensions.


Technology Used
-----------------------

The exercise requirement specified "Kubernetes" but did not specify a platform provider.  For Kubernetes,
I chose to use the EKS offering available from AWS.

For the deployment process, multiple options exist for AWS - some choices are Terraform, Cloudformation, CDK and Pulumi.

I chose to use Pulumi, as I believe it is the most powerful of the options and I have been using it heavily recently.  I hope
that this project will give a bit of insight into the core Pulumi offerings.  In a production environment, further
automation-friendly options would be included such as reusable objects, YAML and JSON template reading/writing for
configuration options and/or further use of the Pulumi stack config offerings.

For the public DNS endpoint, I chose AWS Route53.  The included scripts will automatically use Route53 for creation
of the TLS certifcates, as well as updating the public zone with the application endpoint.

For TLS, I initially chose AWS ACM, but soon realized that EKS (verison 1.14) does not yet support NLB + ACM TLS
Termination.  This feature is expeced in the upcoming 1.15 release.  So, alternatively I chose to use Let's Encrypt
Certbot to create the certificates.
