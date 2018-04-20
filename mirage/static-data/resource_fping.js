export default `{
  "shortdesc": "ping the specified host",
  "longdesc": "This plugin will use the fping command to ping the specified host for a fast check\\nThe threshold is set as pair rta,pl%, where rta is the round trip average\\ntravel time in ms and pl is the percentage of packet loss.\\nNote that it is necessary to set the suid flag on fping.",
  "parameters": [{
    "name": "hostname",
    "default": "",
    "level": "basic",
    "required": true,
    "shortdesc": "name or IP Address of host to ping (IP Address bypasses name lookup, reducing system load)",
    "type": "secret",
    "longdesc": "name or IP Address of host to ping (IP Address bypasses name lookup, reducing system load)"
  }, {
    "name": "warning",
    "default": "",
    "level": "basic",
    "required": false,
    "shortdesc": "warning threshold",
    "type": "string",
    "longdesc": "warning threshold"
  }, {
    "name": "critical",
    "default": "",
    "level": "basic",
    "required": false,
    "shortdesc": "critical threshold",
    "type": "string",
    "longdesc": "critical threshold"
  }, {
    "name": "bytes",
    "default": "56",
    "level": "advanced",
    "required": false,
    "shortdesc": "size of ICMP packet (default: 56)",
    "type": "integer",
    "longdesc": "size of ICMP packet (default: 56)"
  }, {
    "name": "number",
    "default": "1",
    "level": "advanced",
    "required": false,
    "shortdesc": "number of ICMP packets to send (default: 1)",
    "type": "integer",
    "longdesc": "number of ICMP packets to send (default: 1)"
  }, {
    "name": "target-timeout",
    "default": "",
    "level": "basic",
    "required": false,
    "shortdesc": "Target timeout (ms) (default: fping's default for -t)",
    "type": "integer",
    "longdesc": "Target timeout (ms) (default: fping's default for -t)"
  }, {
    "name": "interval",
    "default": "",
    "required": false,
    "shortdesc": "Interval (ms) between sending packets (default: fping's default for -p)",
    "type": "integer",
    "longdesc": "Interval (ms) between sending packets (default: fping's default for -p)"
  }, {
    "name": "extra-opts",
    "default": "",
    "required": false,
    "shortdesc": "ini file with extra options",
    "type": "string",
    "longdesc": "Read options from an ini file. See http://nagiosplugins.org/extra-opts\\nfor usage and examples."
  }],
  "name": "nagios:check_fping"
}`;
