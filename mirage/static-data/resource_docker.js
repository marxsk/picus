export default `{
  "shortdesc": "Docker container resource agent.",
  "longdesc": "The docker HA resource agent creates and launches a docker container \\nbased off a supplied docker image. Containers managed by this agent\\nare both created and removed upon the agent's start and stop actions.",
  "parameters": [{
    "name": "image",
    "default": null,
    "required": true,
    "shortdesc": "docker image",
    "type": "string",
    "longdesc": "The docker image to base this container off of."
  }, {
    "name": "name",
    "default": null,
    "required": false,
    "shortdesc": "docker container name",
    "type": "string",
    "longdesc": "The name to give the created container. By default this will \\nbe that resource's instance name."
  }, {
    "name": "allow_pull",
    "default": null,
    "required": false,
    "shortdesc": "Allow pulling non-local images",
    "type": "boolean",
    "longdesc": "Allow the image to be pulled from the configured docker registry when\\nthe image does not exist locally. NOTE, this can drastically increase\\nthe time required to start the container if the image repository is \\npulled over the network."
  }, {
    "name": "run_opts",
    "default": null,
    "required": false,
    "shortdesc": "run options",
    "type": "string",
    "longdesc": "Add options to be appended to the 'docker run' command which is used\\nwhen creating the container during the start action. This option allows\\nusers to do things such as setting a custom entry point and injecting\\nenvironment variables into the newly created container. Note the '-d' \\noption is supplied regardless of this value to force containers to run \\nin the background.\\n\\nNOTE: Do not explicitly specify the --name argument in the run_opts. This\\nagent will set --name using either the resource's instance or the name\\nprovided in the 'name' argument of this agent."
  }, {
    "name": "run_cmd",
    "default": null,
    "required": false,
    "shortdesc": "run command",
    "type": "string",
    "longdesc": "Specifiy a command to launch within the container once \\nit has initialized."
  }, {
    "name": "monitor_cmd",
    "default": null,
    "required": false,
    "shortdesc": "monitor command",
    "type": "string",
    "longdesc": "Specifiy the full path of a command to launch within the container to check\\nthe health of the container. This command must return 0 to indicate that\\nthe container is healthy. A non-zero return code will indicate that the\\ncontainer has failed and should be recovered.\\n\\nThe command is executed using nsenter. In the future 'docker exec' will\\nbe used once it is more widely supported."
  }, {
    "name": "force_kill",
    "default": null,
    "required": false,
    "shortdesc": "force kill",
    "type": "boolean",
    "longdesc": "Kill a container immediately rather than waiting for it to gracefully\\nshutdown"
  }, {
    "name": "reuse",
    "default": null,
    "required": false,
    "shortdesc": "reuse container",
    "type": "boolean",
    "longdesc": "Allow the container to be reused after stopping the container. By default\\ncontainers are removed after stop. With the reuse option containers\\nwill persist after the container stops."
  }],
  "name": "ocf:heartbeat:docker"
}`;
