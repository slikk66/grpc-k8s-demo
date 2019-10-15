.. _improvements:

Improvements
=======================

TLS Termination on NLB
-----------------------

When EKS reaches version 1.15 on AWS (which should be relatively soon) this solution can be
improved quite a bit by removing the need for Let's Encrypt and the Nginx sidecar system.

According to the docs, adding the annotation of "service.beta.kubernetes.io/aws-load-balancer-ssl"
with an ARN of an ACM certificate should terminate TLS at the NLB, and allow for direct linking
of the NLB to the pods.


TLS Configuration on NLB
-----------------------

Along with the termination, we will be able to adjust TLS policies to maximize security and ensure
compatibility with various devices and Operating Systems.


Optioning / Configuration
-----------------------
Currently most options are hardcoded into the deployments.  Using Pulumi stack configuration variables
is one easy way to set things like instance sizes, regions, ARN values per stack.

A nice feature about Pulumi is the ability to use standard packages like YAML, JSON etc and any
parsing utilites via subprocesses to make queries against cloud APIs, or remote services to get
information like latest image ID, version, URL etc.

However, I feel these are out of the scope of this exercise and have not been included.


Monitoring + APM
-----------------------

This solution contains no monitoring services or Application Performance Management.  Both
of these should be implemented on a Production system.  A few of my preferred items are
CloudWatch and DataDog.  Custom metrics are a great way to provide 'deadman' switches
for any items that are expected to be running, and adding alarms on those metrics
if they cease to be sending up metrics.

Container and LoadBalancer healthchecks are good ways to ensure that the containers are
replying as expected, and healthy.

Simple ping tools such as pingdom.com, statuscake.com are also helpful for verifying that
the site is reachable from multiple locations.

A paging service such as OpsGenie or VictorOps should be included to provide contact
endpoints in case of disruption.


Deployment Versioning Capability
-----------------------

This solution does not go very far in terms of application versioning, secrets versioning (TLS),
or rollback capabilties.  Although that was not the point of the exercise, any Production
system should be outfitted with Kubernetes adjacent systems that can create deployment
manifests, packages, verisoned artifacts that can facilitiate rolling backwards (and forwards.)


Makefile Orchestration
-----------------------

The main method of orchestration on this solution is via ``Makefile``.  While this is good
to encapsulate multiple commands for transport between hosts, it's not a very efficient
way to handle the orchestraion, and BASH can be a fairly picky and complicated language.

Better options are pipelines such as those available on Github, Circle CI, Buddy, CodeBuild,
Jenkins and may more.

Another option that I particular like is to write a small interface application that can be
used to facilitate these types of multi-step orchestrations.  Also, as implementations
may change behind the scenes, pipeline files generally won't as long as they load the same
package, or Docker image, or Go binary etc and run their commands against that interface.

The package/image implementations may be updated behind the scenes,
but much less frequently are the interfaces.
