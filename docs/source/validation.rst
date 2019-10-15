Validation
=======================

Deployment Validation
-----------------------

Provided the output from the Pulumi deployment goes as planned, and there no issues
with the deployment, you should now have a new VPC, EKS Cluster and Network Load Balancer in your account,
along with the Kubernetes service and deployment objects viewable with ``kubectl``.

To do this, let's first set ``kubectl`` to reference the proper configuration file that points
to the appropriate cluster.

Run the following command from the root of this repository ``eval $(make get-kubectl)`` - this will
set ``kubectl`` to be connected to the deployed cluster in the current shell session.

Run ``kubectl get deployments`` and ``kubectl get services`` to see that the proper items
are running on the cluster.


gRPC Validation
-----------------------

Follow the validation instructions provided by the Covr exercise repository located
`here <https://github.com/covrco/candidate-exercises/tree/master/grpc_k8s/>`_.

Due to the fact that the Nginx configuration is defined, and only allows TLS enabled communication
over the port, a non secure test of the system (without -i) will not work.

Please configure a public endpoint with TLS using this guide, as instructed by the exercise.


My Project Validation
-----------------------

My endpoint is online at ``grpc.billeci.com:9001`` and can be tested.

For screenshots of my implementation in action, please see `my repository <https://github.com/slikk66/grpc-k8s-demo/docs/screenshots/>`_.
