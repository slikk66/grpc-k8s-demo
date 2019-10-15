Deployment
=======================

Refresh NPM
-----------------------

Install required NPM packages. Run the following command from the root of this repository ``make refresh-npm``


TLS Configuration
-----------------------

As specified in the :ref:`prerequisites` section we will need to generate a TLS certificate for use on
our public endpoint.

Ensure that your AWS authentication is correct and run the following command from the root of this
repository: ``DOMAIN=yourdomainname.com make generate-tls``

This should generate the proper certificates, in the proper path location, that the system is
expecting.

Any time the TLS certificates need to be refreshed, this step should be refreshed, along with
a new Kubernetes deployment, covered below.


Common Configuration
-----------------------

For all of the steps below, each command can take 2 options ``REGION`` and ``ENV`` inline as environment variables.
The defaults for these are ``us-east-2`` and ``demo``, respectively.  You may edit the defauls at the top of the
``Makefile`` if desired. Note that the supplied ``REGION`` and ``ENV`` vars if they are supplied inline must have
already been executed against the Pulumi stack creation step (below) or they will not be valid options
until this happens.

Example: ``REGION=us-west-2 ENV=staging make pulumi-init`` will now allow this combination of variables to be
deployed using the steps below resulting in a separate copy of the deployment.

If you do not supply these variables inline, the defaults in the ``Makefile`` will be used.


Pulumi Initial Configuration Steps
-----------------------

Create required Pulumi stacks for state tracking: run the following command from the root of this repository ``make pulumi-init``


Initial Infrastructure Setup
-----------------------

Ensure that your AWS and Pulumi authentication is configured correctly, and deploy the base infrastructure.
This process will take about 15 minutes to complete.

Run the following command from the root of this repository ``make init-infrastructure``


Kubernetes Release Deployment
-----------------------

Ensure that your AWS and Pulumi authentication is configured correctly, and release the deployment.
This process will only take a minute or so.

Run the following command from the root of this repository ``make release``


DNS Record Configuation
-----------------------

You are now able to set an endpoint record of your choice in your DNS zone that points to the NLB service
which was created by the deployment.

To see the endpoint, run the following command from the root of this repository ``make show-endpoint``

To automatically set the endpoint to your Route53 zone, run the following command from the root of this
repository ``ZONE=ZYOURZONEID make set-endpoint`` where ``ZYOURZONEID`` is a Route53 zone that is editable under your
current AWS authentication.

The default record will be ``grpc.YOURDOMAIN.COM`` if you wish to change ``grpc`` to something else, pass in
another variable ``RECORD`` to the command, such as:

``ZONE=ZYOURZONEID RECORD=cluster12 make set-endpoint``
