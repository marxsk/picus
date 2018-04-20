export default `{
  "shortdesc": "Fence agent for IPMI",
  "longdesc": "fence_ipmilan is an I/O Fencing agentwhich can be used with machines controlled by IPMI.This agent calls support software ipmitool (http://ipmitool.sf.net/).",
  "parameters": [{
    "name": "action",
    "default": "reboot",
    "required": false,
    "shortdesc": "Fencing Action-WARNING: specifying 'action' is deprecated and not necessary with current Pacemaker versions",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "auth",
    "default": null,
    "required": false,
    "shortdesc": "IPMI Lan Auth type.",
    "type": "select",
    "longdesc": ""
  }, {
    "name": "cipher",
    "default": "0",
    "required": false,
    "shortdesc": "Ciphersuite to use (same as ipmitool -C parameter)",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "inet4_only",
    "default": null,
    "required": false,
    "shortdesc": "Forces agent to use IPv4 addresses only",
    "type": "boolean",
    "longdesc": ""
  }, {
    "name": "inet6_only",
    "default": null,
    "required": false,
    "shortdesc": "Forces agent to use IPv6 addresses only",
    "type": "boolean",
    "longdesc": ""
  }, {
    "name": "ipaddr",
    "default": null,
    "required": true,
    "shortdesc": "IP Address or Hostname",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "ipport",
    "default": "623",
    "required": false,
    "shortdesc": "TCP/UDP port to use for connection with device",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "lanplus",
    "default": "0",
    "required": false,
    "shortdesc": "Use Lanplus to improve security of connection",
    "type": "boolean",
    "longdesc": ""
  }, {
    "name": "login",
    "default": null,
    "required": false,
    "shortdesc": "Login Name",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "method",
    "default": "onoff",
    "required": false,
    "shortdesc": "Method to fence (onoff|cycle)",
    "type": "select",
    "longdesc": ""
  }, {
    "name": "passwd",
    "default": null,
    "required": false,
    "shortdesc": "Login password or passphrase",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "passwd_script",
    "default": null,
    "required": false,
    "shortdesc": "Script to retrieve password",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "privlvl",
    "default": "administrator",
    "required": false,
    "shortdesc": "Privilege level on IPMI device",
    "type": "select",
    "longdesc": ""
  }, {
    "name": "delay",
    "default": "0",
    "required": false,
    "shortdesc": "Wait X seconds before fencing is started",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "ipmitool_path",
    "default": "/usr/bin/ipmitool",
    "required": false,
    "shortdesc": "Path to ipmitool binary",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "login_timeout",
    "default": "5",
    "required": false,
    "shortdesc": "Wait X seconds for cmd prompt after login",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "power_timeout",
    "default": "20",
    "required": false,
    "shortdesc": "Test X seconds for status change after ON/OFF",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "power_wait",
    "default": "0",
    "required": false,
    "shortdesc": "Wait X seconds after issuing ON/OFF",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "shell_timeout",
    "default": "3",
    "required": false,
    "shortdesc": "Wait X seconds for cmd prompt after issuing command",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "retry_on",
    "default": "1",
    "required": false,
    "shortdesc": "Count of attempts to retry power on",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "sudo",
    "default": null,
    "required": false,
    "shortdesc": "Use sudo (without password) when calling 3rd party sotfware.",
    "type": "boolean",
    "longdesc": ""
  }, {
    "name": "sudo_path",
    "default": "/usr/bin/sudo",
    "required": false,
    "shortdesc": "Path to sudo binary",
    "type": "string",
    "longdesc": ""
  }, {
    "name": "priority",
    "default": "0",
    "required": false,
    "shortdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.",
    "type": "integer",
    "longdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.",
    "advanced": false
  }, {
    "name": "pcmk_host_argument",
    "default": "port",
    "required": false,
    "shortdesc": "Advanced use only: An alternate parameter to supply instead of 'port'",
    "type": "string",
    "longdesc": "Advanced use only: An alternate parameter to supply instead of 'port'-Some devices do not support the standard 'port' parameter or may provide additional ones.-Use this to specify an alternate, device-specific, parameter that should indicate the machine to be fenced.-A value of 'none' can be used to tell the cluster not to supply any additional parameters.",
    "advanced": true
  }, {
    "name": "pcmk_host_map",
    "default": "",
    "required": false,
    "shortdesc": "A mapping of host names to ports numbers for devices that do not support host names.",
    "type": "string",
    "longdesc": "A mapping of host names to ports numbers for devices that do not support host names.-Eg. node1:1;node2:2,3 would tell the cluster to use port 1 for node1 and ports 2 and 3 for node2",
    "advanced": false
  }, {
    "name": "pcmk_host_list",
    "default": "",
    "required": false,
    "shortdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).",
    "type": "string",
    "longdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).",
    "advanced": false
  }, {
    "name": "pcmk_host_check",
    "default": "dynamic-list",
    "required": false,
    "shortdesc": "How to determine which machines are controlled by the device.",
    "type": "string",
    "longdesc": "How to determine which machines are controlled by the device.-Allowed values: dynamic-list (query the device), static-list (check the pcmk_host_list attribute), none (assume every device can fence every machine)",
    "advanced": false
  }, {
    "name": "pcmk_delay_max",
    "default": "0s",
    "required": false,
    "shortdesc": "Enable random delay for stonith actions and specify the maximum of random delay",
    "type": "time",
    "longdesc": "Enable random delay for stonith actions and specify the maximum of random delay-This prevents double fencing when using slow devices such as sbd.-Use this to enable random delay for stonith actions and specify the maximum of random delay.",
    "advanced": false
  }, {
    "name": "pcmk_action_limit",
    "default": "1",
    "required": false,
    "shortdesc": "The maximum number of actions can be performed in parallel on this device",
    "type": "integer",
    "longdesc": "The maximum number of actions can be performed in parallel on this device-Pengine property concurrent-fencing=true needs to be configured first.-Then use this to specify the maximum number of actions can be performed in parallel on this device. -1 is unlimited.",
    "advanced": false
  }, {
    "name": "pcmk_reboot_action",
    "default": "reboot",
    "required": false,
    "shortdesc": "Advanced use only: An alternate command to run instead of 'reboot'",
    "type": "string",
    "longdesc": "Advanced use only: An alternate command to run instead of 'reboot'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the 'reboot' action.",
    "advanced": true
  }, {
    "name": "pcmk_reboot_timeout",
    "default": "60s",
    "required": false,
    "shortdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout",
    "type": "time",
    "longdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for 'reboot' actions.",
    "advanced": true
  }, {
    "name": "pcmk_reboot_retries",
    "default": "2",
    "required": false,
    "shortdesc": "Advanced use only: The maximum number of times to retry the 'reboot' command within the timeout period",
    "type": "integer",
    "longdesc": "Advanced use only: The maximum number of times to retry the 'reboot' command within the timeout period-Some devices do not support multiple connections. Operations may 'fail' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries 'reboot' actions before giving up.",
    "advanced": true
  }, {
    "name": "pcmk_off_action",
    "default": "off",
    "required": false,
    "shortdesc": "Advanced use only: An alternate command to run instead of 'off'",
    "type": "string",
    "longdesc": "Advanced use only: An alternate command to run instead of 'off'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the 'off' action.",
    "advanced": true
  }, {
    "name": "pcmk_off_timeout",
    "default": "60s",
    "required": false,
    "shortdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout",
    "type": "time",
    "longdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for 'off' actions.",
    "advanced": true
  }, {
    "name": "pcmk_off_retries",
    "default": "2",
    "required": false,
    "shortdesc": "Advanced use only: The maximum number of times to retry the 'off' command within the timeout period",
    "type": "integer",
    "longdesc": "Advanced use only: The maximum number of times to retry the 'off' command within the timeout period-Some devices do not support multiple connections. Operations may 'fail' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries 'off' actions before giving up.",
    "advanced": true
  }, {
    "name": "pcmk_list_action",
    "default": "list",
    "required": false,
    "shortdesc": "Advanced use only: An alternate command to run instead of 'list'",
    "type": "string",
    "longdesc": "Advanced use only: An alternate command to run instead of 'list'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the 'list' action.",
    "advanced": true
  }, {
    "name": "pcmk_list_timeout",
    "default": "60s",
    "required": false,
    "shortdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout",
    "type": "time",
    "longdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for 'list' actions.",
    "advanced": true
  }, {
    "name": "pcmk_list_retries",
    "default": "2",
    "required": false,
    "shortdesc": "Advanced use only: The maximum number of times to retry the 'list' command within the timeout period",
    "type": "integer",
    "longdesc": "Advanced use only: The maximum number of times to retry the 'list' command within the timeout period-Some devices do not support multiple connections. Operations may 'fail' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries 'list' actions before giving up.",
    "advanced": true
  }, {
    "name": "pcmk_monitor_action",
    "default": "monitor",
    "required": false,
    "shortdesc": "Advanced use only: An alternate command to run instead of 'monitor'",
    "type": "string",
    "longdesc": "Advanced use only: An alternate command to run instead of 'monitor'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the 'monitor' action.",
    "advanced": true
  }, {
    "name": "pcmk_monitor_timeout",
    "default": "60s",
    "required": false,
    "shortdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout",
    "type": "time",
    "longdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for 'monitor' actions.",
    "advanced": true
  }, {
    "name": "pcmk_monitor_retries",
    "default": "2",
    "required": false,
    "shortdesc": "Advanced use only: The maximum number of times to retry the 'monitor' command within the timeout period",
    "type": "integer",
    "longdesc": "Advanced use only: The maximum number of times to retry the 'monitor' command within the timeout period-Some devices do not support multiple connections. Operations may 'fail' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries 'monitor' actions before giving up.",
    "advanced": true
  }, {
    "name": "pcmk_status_action",
    "default": "status",
    "required": false,
    "shortdesc": "Advanced use only: An alternate command to run instead of 'status'",
    "type": "string",
    "longdesc": "Advanced use only: An alternate command to run instead of 'status'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the 'status' action.",
    "advanced": true
  }, {
    "name": "pcmk_status_timeout",
    "default": "60s",
    "required": false,
    "shortdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout",
    "type": "time",
    "longdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for 'status' actions.",
    "advanced": true
  }, {
    "name": "pcmk_status_retries",
    "default": "2",
    "required": false,
    "shortdesc": "Advanced use only: The maximum number of times to retry the 'status' command within the timeout period",
    "type": "integer",
    "longdesc": "Advanced use only: The maximum number of times to retry the 'status' command within the timeout period-Some devices do not support multiple connections. Operations may 'fail' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries 'status' actions before giving up.",
    "advanced": true
  }],
  "name": "stonith:fence_ipmilan"
}`;
