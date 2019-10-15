.. _prerequisites:

Prerequisites
=======================

Binary Installations
-----------------------

Several pieces of software are required to properly install this solution.

Here are the following binaries that you will need installed to properly deploy the solution:

- `Docker <https://docs.docker.com/install/>`_
- `AWS CLI <https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html>`_
- `Pulumi <https://www.pulumi.com/docs/get-started/install/>`_
- `Node JS <https://nodejs.org/en/download/>`_
- `NPM <https://www.npmjs.com/get-npm>`_ (this should come packaged with Node JS)
- `EKS IAM Authenticator <https://docs.aws.amazon.com/eks/latest/userguide/install-aws-iam-authenticator.html>`_
- `kubectl <https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl>`_


Credential Configuration
-----------------------

Accounts and credentials information are required for AWS CLI and Pulumi.

For AWS, the configuration of credentials is out of the scope of this document, but for best results,
either use the ``default`` profile in your ``~/.aws/credentials`` file, or export an environment variable of
``AWS_DEFAULT_PROFILE`` with the name of your preferred profile.

Verify your AWS account by running:
- (IAM User mode): ``aws iam get-user``
- (IAM Role mode): ``aws sts get-caller-identity``

For Pulumi, after installation, simply run ``pulumi login`` on the CLI and follow the instructions to
login with Github via the web browser (just hit enter) to create your free account for this exercise.
Pulumi does allow for unauthenticated logins, but the configuration for that is out of the scope
of this document.

Verify your Pulumi user by running: ``pulumi whoami``


Domain Name Configuration
-----------------------

Requirements for this exercise state that the endpoint must be publicly available, with TLS enabled.

For my solution, I chose to use AWS Route53 for the DNS zone management and Let's Encrypt for the
certificate management.

I intially configured the system to use an ACM certfiicate, but found that
EKS (at version 1.14) does not currently support the proper annotations for TLS enabled listeners on
their Network Load Balancer. In light of that realization, I opted to use Let's Encrypt's certbot
image to generate a wildcard domain to be used by an Nginx sidecar to handle TLS termination.

For this solution to work, you will need to have a DNS zone connected via Route 53 to the AWS account
you authenticated against above.  Any public zone will work, provided your AWS account has the
required permissions to create and then cleanup the challenge records needed by the system
during the automated certificate generation.
