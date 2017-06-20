import Response from 'ember-cli-mirage/response';

export default function() {
  this.timing = 400;      // delay for each request, automatically set to 0 during testing
  this.clusterName = "my";
  this.authenticated = false;

  this.get('/managec/my/cluster_status', (schema) => {
    return schema.clusters.all();
  });

  this.get('/remote/get_avail_fence_agents', () => {
    return '{"fence_apc":{"type":"fence_apc"},"fence_ipmilan":{"type":"fence_ipmilan"}}';
  });

  this.get('/remote/get_avail_resource_agents', () => {
    return {"ocf:.isolation:docker-wrapper":{"type":"docker-wrapper"},"ocf:heartbeat:AoEtarget":{"type":"AoEtarget"},"ocf:heartbeat:AudibleAlarm":{"type":"AudibleAlarm"},"ocf:heartbeat:CTDB":{"type":"CTDB"},"ocf:heartbeat:ClusterMon":{"type":"ClusterMon"},"ocf:heartbeat:Delay":{"type":"Delay"},"ocf:heartbeat:Dummy":{"type":"Dummy"},"ocf:heartbeat:EvmsSCC":{"type":"EvmsSCC"},"ocf:heartbeat:Evmsd":{"type":"Evmsd"},"ocf:heartbeat:Filesystem":{"type":"Filesystem"},"ocf:heartbeat:ICP":{"type":"ICP"},"ocf:heartbeat:IPaddr":{"type":"IPaddr"},"ocf:heartbeat:IPaddr2":{"type":"IPaddr2"},"ocf:heartbeat:IPsrcaddr":{"type":"IPsrcaddr"},"ocf:heartbeat:LVM":{"type":"LVM"},"ocf:heartbeat:LinuxSCSI":{"type":"LinuxSCSI"},"ocf:heartbeat:MailTo":{"type":"MailTo"},"ocf:heartbeat:ManageRAID":{"type":"ManageRAID"},"ocf:heartbeat:ManageVE":{"type":"ManageVE"},"ocf:heartbeat:Pure-FTPd":{"type":"Pure-FTPd"},"ocf:heartbeat:Raid1":{"type":"Raid1"},"ocf:heartbeat:Route":{"type":"Route"},"ocf:heartbeat:SAPDatabase":{"type":"SAPDatabase"},"ocf:heartbeat:SAPInstance":{"type":"SAPInstance"},"ocf:heartbeat:SendArp":{"type":"SendArp"},"ocf:heartbeat:ServeRAID":{"type":"ServeRAID"},"ocf:heartbeat:SphinxSearchDaemon":{"type":"SphinxSearchDaemon"},"ocf:heartbeat:Squid":{"type":"Squid"},"ocf:heartbeat:Stateful":{"type":"Stateful"},"ocf:heartbeat:SysInfo":{"type":"SysInfo"},"ocf:heartbeat:VIPArip":{"type":"VIPArip"},"ocf:heartbeat:VirtualDomain":{"type":"VirtualDomain"},"ocf:heartbeat:WAS":{"type":"WAS"},"ocf:heartbeat:WAS6":{"type":"WAS6"},"ocf:heartbeat:WinPopup":{"type":"WinPopup"},"ocf:heartbeat:Xen":{"type":"Xen"},"ocf:heartbeat:Xinetd":{"type":"Xinetd"},"ocf:heartbeat:anything":{"type":"anything"},"ocf:heartbeat:apache":{"type":"apache"},"ocf:heartbeat:asterisk":{"type":"asterisk"},"ocf:heartbeat:clvm":{"type":"clvm"},"ocf:heartbeat:conntrackd":{"type":"conntrackd"},"ocf:heartbeat:db2":{"type":"db2"},"ocf:heartbeat:dhcpd":{"type":"dhcpd"},"ocf:heartbeat:dnsupdate":{"type":"dnsupdate"},"ocf:heartbeat:docker":{"type":"docker"},"ocf:heartbeat:eDir88":{"type":"eDir88"},"ocf:heartbeat:ethmonitor":{"type":"ethmonitor"},"ocf:heartbeat:exportfs":{"type":"exportfs"},"ocf:heartbeat:fio":{"type":"fio"},"ocf:heartbeat:galera":{"type":"galera"},"ocf:heartbeat:iSCSILogicalUnit":{"type":"iSCSILogicalUnit"},"ocf:heartbeat:iSCSITarget":{"type":"iSCSITarget"},"ocf:heartbeat:ids":{"type":"ids"},"ocf:heartbeat:iface-bridge":{"type":"iface-bridge"},"ocf:heartbeat:iface-vlan":{"type":"iface-vlan"},"ocf:heartbeat:iscsi":{"type":"iscsi"},"ocf:heartbeat:jboss":{"type":"jboss"},"ocf:heartbeat:kamailio":{"type":"kamailio"},"ocf:heartbeat:ldirectord":{"type":"ldirectord"},"ocf:heartbeat:lxc":{"type":"lxc"},"ocf:heartbeat:mysql":{"type":"mysql"},"ocf:heartbeat:mysql-proxy":{"type":"mysql-proxy"},"ocf:heartbeat:named":{"type":"named"},"ocf:heartbeat:nfsnotify":{"type":"nfsnotify"},"ocf:heartbeat:nfsserver":{"type":"nfsserver"},"ocf:heartbeat:nginx":{"type":"nginx"},"ocf:heartbeat:oracle":{"type":"oracle"},"ocf:heartbeat:oralsnr":{"type":"oralsnr"},"ocf:heartbeat:pgsql":{"type":"pgsql"},"ocf:heartbeat:pingd":{"type":"pingd"},"ocf:heartbeat:portblock":{"type":"portblock"},"ocf:heartbeat:postfix":{"type":"postfix"},"ocf:heartbeat:pound":{"type":"pound"},"ocf:heartbeat:proftpd":{"type":"proftpd"},"ocf:heartbeat:rabbitmq-cluster":{"type":"rabbitmq-cluster"},"ocf:heartbeat:redis":{"type":"redis"},"ocf:heartbeat:rsyncd":{"type":"rsyncd"},"ocf:heartbeat:rsyslog":{"type":"rsyslog"},"ocf:heartbeat:scsi2reservation":{"type":"scsi2reservation"},"ocf:heartbeat:sfex":{"type":"sfex"},"ocf:heartbeat:sg_persist":{"type":"sg_persist"},"ocf:heartbeat:slapd":{"type":"slapd"},"ocf:heartbeat:symlink":{"type":"symlink"},"ocf:heartbeat:syslog-ng":{"type":"syslog-ng"},"ocf:heartbeat:tomcat":{"type":"tomcat"},"ocf:heartbeat:varnish":{"type":"varnish"},"ocf:heartbeat:vmware":{"type":"vmware"},"ocf:heartbeat:zabbixserver":{"type":"zabbixserver"},"ocf:pacemaker:ClusterMon":{"type":"ClusterMon"},"ocf:pacemaker:Dummy":{"type":"Dummy"},"ocf:pacemaker:HealthCPU":{"type":"HealthCPU"},"ocf:pacemaker:HealthSMART":{"type":"HealthSMART"},"ocf:pacemaker:Stateful":{"type":"Stateful"},"ocf:pacemaker:SysInfo":{"type":"SysInfo"},"ocf:pacemaker:SystemHealth":{"type":"SystemHealth"},"ocf:pacemaker:controld":{"type":"controld"},"ocf:pacemaker:ping":{"type":"ping"},"ocf:pacemaker:pingd":{"type":"pingd"},"ocf:pacemaker:remote":{"type":"remote"},"lsb:netconsole":{"type":"netconsole"},"lsb:network":{"type":"network"},"systemd:abrt-ccpp":{"type":"abrt-ccpp"},"systemd:abrt-journal-core":{"type":"abrt-journal-core"},"systemd:abrt-oops":{"type":"abrt-oops"},"systemd:abrt-pstoreoops":{"type":"abrt-pstoreoops"},"systemd:abrt-vmcore":{"type":"abrt-vmcore"},"systemd:abrt-xorg":{"type":"abrt-xorg"},"systemd:abrtd":{"type":"abrtd"},"systemd:arp-ethers":{"type":"arp-ethers"},"systemd:atd":{"type":"atd"},"systemd:auditd":{"type":"auditd"},"systemd:auth-rpcgss-module":{"type":"auth-rpcgss-module"},"systemd:autofs":{"type":"autofs"},"systemd:autovt@":{"type":"autovt@"},"systemd:blk-availability":{"type":"blk-availability"},"systemd:certmonger":{"type":"certmonger"},"systemd:chrony-dnssrv@":{"type":"chrony-dnssrv@"},"systemd:chrony-wait":{"type":"chrony-wait"},"systemd:chronyd":{"type":"chronyd"},"systemd:cockpit":{"type":"cockpit"},"systemd:console-getty":{"type":"console-getty"},"systemd:console-shell":{"type":"console-shell"},"systemd:container-getty@":{"type":"container-getty@"},"systemd:corosync-notifyd":{"type":"corosync-notifyd"},"systemd:corosync":{"type":"corosync"},"systemd:crm_mon":{"type":"crm_mon"},"systemd:crond":{"type":"crond"},"systemd:dbus-org.fedoraproject.rolekit1":{"type":"dbus-org.fedoraproject.rolekit1"},"systemd:dbus-org.freedesktop.hostname1":{"type":"dbus-org.freedesktop.hostname1"},"systemd:dbus-org.freedesktop.import1":{"type":"dbus-org.freedesktop.import1"},"systemd:dbus-org.freedesktop.locale1":{"type":"dbus-org.freedesktop.locale1"},"systemd:dbus-org.freedesktop.login1":{"type":"dbus-org.freedesktop.login1"},"systemd:dbus-org.freedesktop.machine1":{"type":"dbus-org.freedesktop.machine1"},"systemd:dbus-org.freedesktop.network1":{"type":"dbus-org.freedesktop.network1"},"systemd:dbus-org.freedesktop.NetworkManager":{"type":"dbus-org.freedesktop.NetworkManager"},"systemd:dbus-org.freedesktop.nm-dispatcher":{"type":"dbus-org.freedesktop.nm-dispatcher"},"systemd:dbus-org.freedesktop.resolve1":{"type":"dbus-org.freedesktop.resolve1"},"systemd:dbus-org.freedesktop.timedate1":{"type":"dbus-org.freedesktop.timedate1"},"systemd:dbus":{"type":"dbus"},"systemd:debug-shell":{"type":"debug-shell"},"systemd:dlm":{"type":"dlm"},"systemd:dm-event":{"type":"dm-event"},"systemd:dnf-makecache":{"type":"dnf-makecache"},"systemd:dnsmasq":{"type":"dnsmasq"},"systemd:docker-storage-setup":{"type":"docker-storage-setup"},"systemd:docker":{"type":"docker"},"systemd:dracut-cmdline":{"type":"dracut-cmdline"},"systemd:dracut-initqueue":{"type":"dracut-initqueue"},"systemd:dracut-mount":{"type":"dracut-mount"},"systemd:dracut-pre-mount":{"type":"dracut-pre-mount"},"systemd:dracut-pre-pivot":{"type":"dracut-pre-pivot"},"systemd:dracut-pre-trigger":{"type":"dracut-pre-trigger"},"systemd:dracut-pre-udev":{"type":"dracut-pre-udev"},"systemd:dracut-shutdown":{"type":"dracut-shutdown"},"systemd:ebtables":{"type":"ebtables"},"systemd:emergency":{"type":"emergency"},"systemd:fancontrol":{"type":"fancontrol"},"systemd:fedora-autorelabel-mark":{"type":"fedora-autorelabel-mark"},"systemd:fedora-autorelabel":{"type":"fedora-autorelabel"},"systemd:fedora-domainname":{"type":"fedora-domainname"},"systemd:fedora-import-state":{"type":"fedora-import-state"},"systemd:fedora-loadmodules":{"type":"fedora-loadmodules"},"systemd:fedora-readonly":{"type":"fedora-readonly"},"systemd:firewalld":{"type":"firewalld"},"systemd:fprintd":{"type":"fprintd"},"systemd:fstrim":{"type":"fstrim"},"systemd:getty@":{"type":"getty@"},"systemd:gssproxy":{"type":"gssproxy"},"systemd:halt-local":{"type":"halt-local"},"systemd:initrd-cleanup":{"type":"initrd-cleanup"},"systemd:initrd-parse-etc":{"type":"initrd-parse-etc"},"systemd:initrd-switch-root":{"type":"initrd-switch-root"},"systemd:initrd-udevadm-cleanup-db":{"type":"initrd-udevadm-cleanup-db"},"systemd:ipmievd":{"type":"ipmievd"},"systemd:irda":{"type":"irda"},"systemd:irqbalance":{"type":"irqbalance"},"systemd:iscsi-shutdown":{"type":"iscsi-shutdown"},"systemd:iscsi":{"type":"iscsi"},"systemd:iscsid":{"type":"iscsid"},"systemd:iscsiuio":{"type":"iscsiuio"},"systemd:kdump":{"type":"kdump"},"systemd:kmod-static-nodes":{"type":"kmod-static-nodes"},"systemd:ldconfig":{"type":"ldconfig"},"systemd:lm_sensors":{"type":"lm_sensors"},"systemd:lvm2-lvmetad":{"type":"lvm2-lvmetad"},"systemd:lvm2-lvmpolld":{"type":"lvm2-lvmpolld"},"systemd:lvm2-monitor":{"type":"lvm2-monitor"},"systemd:lvm2-pvscan@":{"type":"lvm2-pvscan@"},"systemd:mcelog":{"type":"mcelog"},"systemd:mdadm-grow-continue@":{"type":"mdadm-grow-continue@"},"systemd:mdadm-last-resort@":{"type":"mdadm-last-resort@"},"systemd:mdmon@":{"type":"mdmon@"},"systemd:mdmonitor":{"type":"mdmonitor"},"systemd:messagebus":{"type":"messagebus"},"systemd:mlocate-updatedb":{"type":"mlocate-updatedb"},"systemd:multipathd":{"type":"multipathd"},"systemd:NetworkManager-dispatcher":{"type":"NetworkManager-dispatcher"},"systemd:NetworkManager-wait-online":{"type":"NetworkManager-wait-online"},"systemd:NetworkManager":{"type":"NetworkManager"},"systemd:nfs-blkmap":{"type":"nfs-blkmap"},"systemd:nfs-config":{"type":"nfs-config"},"systemd:nfs-idmap":{"type":"nfs-idmap"},"systemd:nfs-idmapd":{"type":"nfs-idmapd"},"systemd:nfs-lock":{"type":"nfs-lock"},"systemd:nfs-mountd":{"type":"nfs-mountd"},"systemd:nfs-secure":{"type":"nfs-secure"},"systemd:nfs-server":{"type":"nfs-server"},"systemd:nfs-utils":{"type":"nfs-utils"},"systemd:nfs":{"type":"nfs"},"systemd:ntpd":{"type":"ntpd"},"systemd:ntpdate":{"type":"ntpdate"},"systemd:oddjobd":{"type":"oddjobd"},"systemd:openhpid":{"type":"openhpid"},"systemd:pacemaker":{"type":"pacemaker"},"systemd:packagekit-offline-update":{"type":"packagekit-offline-update"},"systemd:packagekit":{"type":"packagekit"},"systemd:pcscd":{"type":"pcscd"},"systemd:pcsd":{"type":"pcsd"},"systemd:plymouth-halt":{"type":"plymouth-halt"},"systemd:plymouth-kexec":{"type":"plymouth-kexec"},"systemd:plymouth-poweroff":{"type":"plymouth-poweroff"},"systemd:plymouth-quit-wait":{"type":"plymouth-quit-wait"},"systemd:plymouth-quit":{"type":"plymouth-quit"},"systemd:plymouth-read-write":{"type":"plymouth-read-write"},"systemd:plymouth-reboot":{"type":"plymouth-reboot"},"systemd:plymouth-start":{"type":"plymouth-start"},"systemd:plymouth-switch-root":{"type":"plymouth-switch-root"},"systemd:polkit":{"type":"polkit"},"systemd:psacct":{"type":"psacct"},"systemd:quotaon":{"type":"quotaon"},"systemd:rc-local":{"type":"rc-local"},"systemd:rdisc":{"type":"rdisc"},"systemd:realmd":{"type":"realmd"},"systemd:rescue":{"type":"rescue"},"systemd:rngd":{"type":"rngd"},"systemd:rolekit":{"type":"rolekit"},"systemd:rpc-gssd":{"type":"rpc-gssd"},"systemd:rpc-statd-notify":{"type":"rpc-statd-notify"},"systemd:rpc-statd":{"type":"rpc-statd"},"systemd:rpc-svcgssd":{"type":"rpc-svcgssd"},"systemd:rpcbind":{"type":"rpcbind"},"systemd:rsyslog":{"type":"rsyslog"},"systemd:serial-getty@":{"type":"serial-getty@"},"systemd:smartd":{"type":"smartd"},"systemd:sshd-keygen":{"type":"sshd-keygen"},"systemd:sshd":{"type":"sshd"},"systemd:sshd@":{"type":"sshd@"},"systemd:sssd":{"type":"sssd"},"systemd:storaged":{"type":"storaged"},"systemd:stunnel":{"type":"stunnel"},"systemd:syslog":{"type":"syslog"},"systemd:systemd-ask-password-console":{"type":"systemd-ask-password-console"},"systemd:systemd-ask-password-plymouth":{"type":"systemd-ask-password-plymouth"},"systemd:systemd-ask-password-wall":{"type":"systemd-ask-password-wall"},"systemd:systemd-backlight@":{"type":"systemd-backlight@"},"systemd:systemd-binfmt":{"type":"systemd-binfmt"},"systemd:systemd-bootchart":{"type":"systemd-bootchart"},"systemd:systemd-bus-proxyd":{"type":"systemd-bus-proxyd"},"systemd:systemd-firstboot":{"type":"systemd-firstboot"},"systemd:systemd-fsck-root":{"type":"systemd-fsck-root"},"systemd:systemd-fsck@":{"type":"systemd-fsck@"},"systemd:systemd-halt":{"type":"systemd-halt"},"systemd:systemd-hibernate-resume@":{"type":"systemd-hibernate-resume@"},"systemd:systemd-hibernate":{"type":"systemd-hibernate"},"systemd:systemd-hostnamed":{"type":"systemd-hostnamed"},"systemd:systemd-hwdb-update":{"type":"systemd-hwdb-update"},"systemd:systemd-hybrid-sleep":{"type":"systemd-hybrid-sleep"},"systemd:systemd-importd":{"type":"systemd-importd"},"systemd:systemd-initctl":{"type":"systemd-initctl"},"systemd:systemd-journal-catalog-update":{"type":"systemd-journal-catalog-update"},"systemd:systemd-journal-flush":{"type":"systemd-journal-flush"},"systemd:systemd-journald":{"type":"systemd-journald"},"systemd:systemd-kexec":{"type":"systemd-kexec"},"systemd:systemd-localed":{"type":"systemd-localed"},"systemd:systemd-logind":{"type":"systemd-logind"},"systemd:systemd-machine-id-commit":{"type":"systemd-machine-id-commit"},"systemd:systemd-machined":{"type":"systemd-machined"},"systemd:systemd-modules-load":{"type":"systemd-modules-load"},"systemd:systemd-networkd-wait-online":{"type":"systemd-networkd-wait-online"},"systemd:systemd-networkd":{"type":"systemd-networkd"},"systemd:systemd-nspawn@":{"type":"systemd-nspawn@"},"systemd:systemd-poweroff":{"type":"systemd-poweroff"},"systemd:systemd-quotacheck":{"type":"systemd-quotacheck"},"systemd:systemd-random-seed":{"type":"systemd-random-seed"},"systemd:systemd-reboot":{"type":"systemd-reboot"},"systemd:systemd-remount-fs":{"type":"systemd-remount-fs"},"systemd:systemd-resolved":{"type":"systemd-resolved"},"systemd:systemd-rfkill@":{"type":"systemd-rfkill@"},"systemd:systemd-suspend":{"type":"systemd-suspend"},"systemd:systemd-sysctl":{"type":"systemd-sysctl"},"systemd:systemd-sysusers":{"type":"systemd-sysusers"},"systemd:systemd-timedated":{"type":"systemd-timedated"},"systemd:systemd-timesyncd":{"type":"systemd-timesyncd"},"systemd:systemd-tmpfiles-clean":{"type":"systemd-tmpfiles-clean"},"systemd:systemd-tmpfiles-setup-dev":{"type":"systemd-tmpfiles-setup-dev"},"systemd:systemd-tmpfiles-setup":{"type":"systemd-tmpfiles-setup"},"systemd:systemd-udev-settle":{"type":"systemd-udev-settle"},"systemd:systemd-udev-trigger":{"type":"systemd-udev-trigger"},"systemd:systemd-udevd":{"type":"systemd-udevd"},"systemd:systemd-update-done":{"type":"systemd-update-done"},"systemd:systemd-update-utmp-runlevel":{"type":"systemd-update-utmp-runlevel"},"systemd:systemd-update-utmp":{"type":"systemd-update-utmp"},"systemd:systemd-user-sessions":{"type":"systemd-user-sessions"},"systemd:systemd-vconsole-setup":{"type":"systemd-vconsole-setup"},"systemd:tcsd":{"type":"tcsd"},"systemd:timedatex":{"type":"timedatex"},"systemd:tog-pegasus":{"type":"tog-pegasus"},"systemd:unbound-anchor":{"type":"unbound-anchor"},"systemd:user@":{"type":"user@"},"systemd:winbind":{"type":"winbind"},"nagios:check_fping":{"type":"check_fping"},"nagios:check_http":{"type":"check_http"},"nagios:check_ldap":{"type":"check_ldap"},"nagios:check_mysql":{"type":"check_mysql"},"nagios:check_pgsql":{"type":"check_pgsql"},"nagios:check_tcp":{"type":"check_tcp"},"nagios:check_udp":{"type":"check_udp"}};
  });

  this.get(`/managec/${this.clusterName}/get_fence_agent_metadata`, (schema, request) => {
    switch (request.queryParams.agent) {
      case 'stonith:fence_apc':
        return '{"shortdesc": "Fence agent for APC over telnet/ssh", "longdesc": "fence_apc is an I/O Fencing agent which can be used with the APC network power switch. It logs into device via telnet/ssh  and reboots a specified outlet. Lengthy telnet/ssh connections should be avoided while a GFS cluster  is  running  because  the  connection will block any necessary fencing actions.", "parameters": [{"name": "action", "default": "reboot", "required": false, "shortdesc": "Fencing Action- WARNING: specifying \'action\' is deprecated and not necessary with current Pacemaker versions", "type": "string", "longdesc": ""}, {"name": "cmd_prompt", "default": "[\'n>\', \'napc>\']", "required": false, "shortdesc": "Force Python regex for command prompt", "type": "string", "longdesc": ""}, {"name": "identity_file", "default": null, "required": false, "shortdesc": "Identity file for ssh", "type": "string", "longdesc": ""}, {"name": "inet4_only", "default": "1", "required": false, "shortdesc": "Forces agent to use IPv4 addresses only", "type": "boolean", "longdesc": ""}, {"name": "inet6_only", "default": null, "required": false, "shortdesc": "Forces agent to use IPv6 addresses only", "type": "boolean", "longdesc": ""}, {"name": "ipaddr", "default": null, "required": true, "shortdesc": "IP Address or Hostname", "type": "string", "longdesc": ""}, {"name": "ipport", "default": "23", "required": false, "shortdesc": "TCP/UDP port to use for connection with device", "type": "string", "longdesc": ""}, {"name": "login", "default": null, "required": true, "shortdesc": "Login Name", "type": "string", "longdesc": ""}, {"name": "passwd", "default": null, "required": false, "shortdesc": "Login password or passphrase", "type": "string", "longdesc": ""}, {"name": "passwd_script", "default": null, "required": false, "shortdesc": "Script to retrieve password", "type": "string", "longdesc": ""}, {"name": "port", "default": null, "required": true, "shortdesc": "Physical plug number, name of virtual machine or UUID", "type": "string", "longdesc": ""}, {"name": "secure", "default": null, "required": false, "shortdesc": "SSH connection", "type": "boolean", "longdesc": ""}, {"name": "ssh_options", "default": "-1 -c blowfish", "required": false, "shortdesc": "SSH options to use", "type": "string", "longdesc": ""}, {"name": "switch", "default": null, "required": false, "shortdesc": "Physical switch number on device", "type": "string", "longdesc": ""}, {"name": "separator", "default": ",", "required": false, "shortdesc": "Separator for CSV created by operation list", "type": "string", "longdesc": ""}, {"name": "delay", "default": "0", "required": false, "shortdesc": "Wait X seconds before fencing is started", "type": "string", "longdesc": ""}, {"name": "login_timeout", "default": "5", "required": false, "shortdesc": "Wait X seconds for cmd prompt after login", "type": "string", "longdesc": ""}, {"name": "power_timeout", "default": "20", "required": false, "shortdesc": "Test X seconds for status change after ON/OFF", "type": "string", "longdesc": ""}, {"name": "power_wait", "default": "0", "required": false, "shortdesc": "Wait X seconds after issuing ON/OFF", "type": "string", "longdesc": ""}, {"name": "shell_timeout", "default": "3", "required": false, "shortdesc": "Wait X seconds for cmd prompt after issuing command", "type": "string", "longdesc": ""}, {"name": "retry_on", "default": "1", "required": false, "shortdesc": "Count of attempts to retry power on", "type": "string", "longdesc": ""}, {"name": "ssh_path", "default": "/usr/bin/ssh", "required": false, "shortdesc": "Path to ssh binary", "type": "string", "longdesc": ""}, {"name": "telnet_path", "default": "/usr/bin/telnet", "required": false, "shortdesc": "Path to telnet binary", "type": "string", "longdesc": ""}, {"name": "priority", "default": "0", "required": false, "shortdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "type": "integer", "longdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "advanced": false}, {"name": "pcmk_host_argument", "default": "port", "required": false, "shortdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'", "type": "string", "longdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'. Some devices do not support the standard \'port\' parameter or may provide additional ones. Use this to specify an alternate, device-specific, parameter that should indicate the machine to be fenced. A value of \'none\' can be used to tell the cluster not to supply any additional parameters.", "advanced": true}, {"name": "pcmk_host_map", "default": "", "required": false, "shortdesc": "A mapping of host names to ports numbers for devices that do not support host names.", "type": "string", "longdesc": "A mapping of host names to ports numbers for devices that do not support host names.-Eg. node1:1;node2:2,3 would tell the cluster to use port 1 for node1 and ports 2 and 3 for node2", "advanced": false}, {"name": "pcmk_host_list", "default": "", "required": false, "shortdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "type": "string", "longdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "advanced": false}, {"name": "pcmk_host_check", "default": "dynamic-list", "required": false, "shortdesc": "How to determine which machines are controlled by the device.", "type": "string", "longdesc": "How to determine which machines are controlled by the device.-Allowed values: dynamic-list (query the device), static-list (check the pcmk_host_list attribute), none (assume every device can fence every machine)", "advanced": false}, {"name": "pcmk_delay_max", "default": "0s", "required": false, "shortdesc": "Enable random delay for stonith actions and specify the maximum of random delay", "type": "time", "longdesc": "Enable random delay for stonith actions and specify the maximum of random delay-This prevents double fencing when using slow devices such as sbd.-Use this to enable random delay for stonith actions and specify the maximum of random delay.", "advanced": false}, {"name": "pcmk_action_limit", "default": "1", "required": false, "shortdesc": "The maximum number of actions can be performed in parallel on this device", "type": "integer", "longdesc": "The maximum number of actions can be performed in parallel on this device-Pengine property concurrent-fencing=true needs to be configured first.-Then use this to specify the maximum number of actions can be performed in parallel on this device. -1 is unlimited.", "advanced": false}, {"name": "pcmk_reboot_action", "default": "reboot", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'reboot\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'reboot\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'reboot\' action.", "advanced": true}, {"name": "pcmk_reboot_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'reboot\' actions.", "advanced": true}, {"name": "pcmk_reboot_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'reboot\' actions before giving up.", "advanced": true}, {"name": "pcmk_off_action", "default": "off", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'off\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'off\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'off\' action.", "advanced": true}, {"name": "pcmk_off_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'off\' actions.", "advanced": true}, {"name": "pcmk_off_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'off\' actions before giving up.", "advanced": true}, {"name": "pcmk_list_action", "default": "list", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'list\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'list\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'list\' action.", "advanced": true}, {"name": "pcmk_list_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'list\' actions.", "advanced": true}, {"name": "pcmk_list_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'list\' actions before giving up.", "advanced": true}, {"name": "pcmk_monitor_action", "default": "monitor", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'monitor\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'monitor\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'monitor\' action.", "advanced": true}, {"name": "pcmk_monitor_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'monitor\' actions.", "advanced": true}, {"name": "pcmk_monitor_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'monitor\' actions before giving up.", "advanced": true}, {"name": "pcmk_status_action", "default": "status", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'status\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'status\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'status\' action.", "advanced": true}, {"name": "pcmk_status_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'status\' actions.", "advanced": true}, {"name": "pcmk_status_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'status\' actions before giving up.", "advanced": true}], "name": "stonith:fence_apc"}';
      case 'stonith:fence_ipmilan':
        return '{"shortdesc": "Fence agent for IPMI", "longdesc": "fence_ipmilan is an I/O Fencing agentwhich can be used with machines controlled by IPMI.This agent calls support software ipmitool (http://ipmitool.sf.net/).", "parameters": [{"name": "action", "default": "reboot", "required": false, "shortdesc": "Fencing Action-WARNING: specifying \'action\' is deprecated and not necessary with current Pacemaker versions", "type": "string", "longdesc": ""}, {"name": "auth", "default": null, "required": false, "shortdesc": "IPMI Lan Auth type.", "type": "select", "longdesc": ""}, {"name": "cipher", "default": "0", "required": false, "shortdesc": "Ciphersuite to use (same as ipmitool -C parameter)", "type": "string", "longdesc": ""}, {"name": "inet4_only", "default": null, "required": false, "shortdesc": "Forces agent to use IPv4 addresses only", "type": "boolean", "longdesc": ""}, {"name": "inet6_only", "default": null, "required": false, "shortdesc": "Forces agent to use IPv6 addresses only", "type": "boolean", "longdesc": ""}, {"name": "ipaddr", "default": null, "required": true, "shortdesc": "IP Address or Hostname", "type": "string", "longdesc": ""}, {"name": "ipport", "default": "623", "required": false, "shortdesc": "TCP/UDP port to use for connection with device", "type": "string", "longdesc": ""}, {"name": "lanplus", "default": "0", "required": false, "shortdesc": "Use Lanplus to improve security of connection", "type": "boolean", "longdesc": ""}, {"name": "login", "default": null, "required": false, "shortdesc": "Login Name", "type": "string", "longdesc": ""}, {"name": "method", "default": "onoff", "required": false, "shortdesc": "Method to fence (onoff|cycle)", "type": "select", "longdesc": ""}, {"name": "passwd", "default": null, "required": false, "shortdesc": "Login password or passphrase", "type": "string", "longdesc": ""}, {"name": "passwd_script", "default": null, "required": false, "shortdesc": "Script to retrieve password", "type": "string", "longdesc": ""}, {"name": "privlvl", "default": "administrator", "required": false, "shortdesc": "Privilege level on IPMI device", "type": "select", "longdesc": ""}, {"name": "delay", "default": "0", "required": false, "shortdesc": "Wait X seconds before fencing is started", "type": "string", "longdesc": ""}, {"name": "ipmitool_path", "default": "/usr/bin/ipmitool", "required": false, "shortdesc": "Path to ipmitool binary", "type": "string", "longdesc": ""}, {"name": "login_timeout", "default": "5", "required": false, "shortdesc": "Wait X seconds for cmd prompt after login", "type": "string", "longdesc": ""}, {"name": "power_timeout", "default": "20", "required": false, "shortdesc": "Test X seconds for status change after ON/OFF", "type": "string", "longdesc": ""}, {"name": "power_wait", "default": "0", "required": false, "shortdesc": "Wait X seconds after issuing ON/OFF", "type": "string", "longdesc": ""}, {"name": "shell_timeout", "default": "3", "required": false, "shortdesc": "Wait X seconds for cmd prompt after issuing command", "type": "string", "longdesc": ""}, {"name": "retry_on", "default": "1", "required": false, "shortdesc": "Count of attempts to retry power on", "type": "string", "longdesc": ""}, {"name": "sudo", "default": null, "required": false, "shortdesc": "Use sudo (without password) when calling 3rd party sotfware.", "type": "boolean", "longdesc": ""}, {"name": "sudo_path", "default": "/usr/bin/sudo", "required": false, "shortdesc": "Path to sudo binary", "type": "string", "longdesc": ""}, {"name": "priority", "default": "0", "required": false, "shortdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "type": "integer", "longdesc": "The priority of the stonith resource. Devices are tried in order of highest priority to lowest.", "advanced": false}, {"name": "pcmk_host_argument", "default": "port", "required": false, "shortdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'", "type": "string", "longdesc": "Advanced use only: An alternate parameter to supply instead of \'port\'-Some devices do not support the standard \'port\' parameter or may provide additional ones.-Use this to specify an alternate, device-specific, parameter that should indicate the machine to be fenced.-A value of \'none\' can be used to tell the cluster not to supply any additional parameters.", "advanced": true}, {"name": "pcmk_host_map", "default": "", "required": false, "shortdesc": "A mapping of host names to ports numbers for devices that do not support host names.", "type": "string", "longdesc": "A mapping of host names to ports numbers for devices that do not support host names.-Eg. node1:1;node2:2,3 would tell the cluster to use port 1 for node1 and ports 2 and 3 for node2", "advanced": false}, {"name": "pcmk_host_list", "default": "", "required": false, "shortdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "type": "string", "longdesc": "A list of machines controlled by this device (Optional unless pcmk_host_check=static-list).", "advanced": false}, {"name": "pcmk_host_check", "default": "dynamic-list", "required": false, "shortdesc": "How to determine which machines are controlled by the device.", "type": "string", "longdesc": "How to determine which machines are controlled by the device.-Allowed values: dynamic-list (query the device), static-list (check the pcmk_host_list attribute), none (assume every device can fence every machine)", "advanced": false}, {"name": "pcmk_delay_max", "default": "0s", "required": false, "shortdesc": "Enable random delay for stonith actions and specify the maximum of random delay", "type": "time", "longdesc": "Enable random delay for stonith actions and specify the maximum of random delay-This prevents double fencing when using slow devices such as sbd.-Use this to enable random delay for stonith actions and specify the maximum of random delay.", "advanced": false}, {"name": "pcmk_action_limit", "default": "1", "required": false, "shortdesc": "The maximum number of actions can be performed in parallel on this device", "type": "integer", "longdesc": "The maximum number of actions can be performed in parallel on this device-Pengine property concurrent-fencing=true needs to be configured first.-Then use this to specify the maximum number of actions can be performed in parallel on this device. -1 is unlimited.", "advanced": false}, {"name": "pcmk_reboot_action", "default": "reboot", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'reboot\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'reboot\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'reboot\' action.", "advanced": true}, {"name": "pcmk_reboot_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for reboot actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'reboot\' actions.", "advanced": true}, {"name": "pcmk_reboot_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'reboot\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'reboot\' actions before giving up.", "advanced": true}, {"name": "pcmk_off_action", "default": "off", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'off\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'off\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'off\' action.", "advanced": true}, {"name": "pcmk_off_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for off actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'off\' actions.", "advanced": true}, {"name": "pcmk_off_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'off\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'off\' actions before giving up.", "advanced": true}, {"name": "pcmk_list_action", "default": "list", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'list\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'list\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'list\' action.", "advanced": true}, {"name": "pcmk_list_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for list actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'list\' actions.", "advanced": true}, {"name": "pcmk_list_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'list\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'list\' actions before giving up.", "advanced": true}, {"name": "pcmk_monitor_action", "default": "monitor", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'monitor\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'monitor\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'monitor\' action.", "advanced": true}, {"name": "pcmk_monitor_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for monitor actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'monitor\' actions.", "advanced": true}, {"name": "pcmk_monitor_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'monitor\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'monitor\' actions before giving up.", "advanced": true}, {"name": "pcmk_status_action", "default": "status", "required": false, "shortdesc": "Advanced use only: An alternate command to run instead of \'status\'", "type": "string", "longdesc": "Advanced use only: An alternate command to run instead of \'status\'-Some devices do not support the standard commands or may provide additional ones.-Use this to specify an alternate, device-specific, command that implements the \'status\' action.", "advanced": true}, {"name": "pcmk_status_timeout", "default": "60s", "required": false, "shortdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout", "type": "time", "longdesc": "Advanced use only: Specify an alternate timeout to use for status actions instead of stonith-timeout-Some devices need much more/less time to complete than normal.-Use this to specify an alternate, device-specific, timeout for \'status\' actions.", "advanced": true}, {"name": "pcmk_status_retries", "default": "2", "required": false, "shortdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period", "type": "integer", "longdesc": "Advanced use only: The maximum number of times to retry the \'status\' command within the timeout period-Some devices do not support multiple connections. Operations may \'fail\' if the device is busy with another task so Pacemaker will automatically retry the operation, if there is time remaining. Use this option to alter the number of times Pacemaker retries \'status\' actions before giving up.", "advanced": true}], "name": "stonith:fence_ipmilan"}';

      default:
        return {};
    }
  });

  this.get(`/managec/${this.clusterName}/get_resource_agent_metadata`, (schema, request) => {
    switch (request.queryParams.agent) {
      case 'nagios:check_fping':
        return '{"shortdesc": "ping the specified host", "longdesc": "This plugin will use the fping command to ping the specified host for a fast check\\nThe threshold is set as pair rta,pl%, where rta is the round trip average\\ntravel time in ms and pl is the percentage of packet loss.\\nNote that it is necessary to set the suid flag on fping.", "parameters": [{"name": "hostname", "default": "", "level": "basic", "required": true, "shortdesc": "name or IP Address of host to ping (IP Address bypasses name lookup, reducing system load)", "type": "secret", "longdesc": "name or IP Address of host to ping (IP Address bypasses name lookup, reducing system load)"}, {"name": "warning", "default": "", "level": "basic", "required": false, "shortdesc": "warning threshold", "type": "string", "longdesc": "warning threshold"}, {"name": "critical", "default": "", "level": "basic", "required": false, "shortdesc": "critical threshold", "type": "string", "longdesc": "critical threshold"}, {"name": "bytes", "default": "56", "level": "advanced", "required": false, "shortdesc": "size of ICMP packet (default: 56)", "type": "integer", "longdesc": "size of ICMP packet (default: 56)"}, {"name": "number", "default": "1", "level": "advanced", "required": false, "shortdesc": "number of ICMP packets to send (default: 1)", "type": "integer", "longdesc": "number of ICMP packets to send (default: 1)"}, {"name": "target-timeout", "default": "", "level": "basic", "required": false, "shortdesc": "Target timeout (ms) (default: fping\'s default for -t)", "type": "integer", "longdesc": "Target timeout (ms) (default: fping\'s default for -t)"}, {"name": "interval", "default": "", "required": false, "shortdesc": "Interval (ms) between sending packets (default: fping\'s default for -p)", "type": "integer", "longdesc": "Interval (ms) between sending packets (default: fping\'s default for -p)"}, {"name": "extra-opts", "default": "", "required": false, "shortdesc": "ini file with extra options", "type": "string", "longdesc": "Read options from an ini file. See http://nagiosplugins.org/extra-opts\\nfor usage and examples."}], "name": "nagios:check_fping"}';
      case 'ocf:heartbeat:docker':
        return '{"shortdesc": "Docker container resource agent.", "longdesc": "The docker HA resource agent creates and launches a docker container\\nbased off a supplied docker image. Containers managed by this agent\\nare both created and removed upon the agent\'s start and stop actions.", "parameters": [{"name": "image", "default": null, "required": true, "shortdesc": "docker image", "type": "string", "longdesc": "The docker image to base this container off of."}, {"name": "name", "default": null, "required": false, "shortdesc": "docker container name", "type": "string", "longdesc": "The name to give the created container. By default this will \\nbe that resource\'s instance name."}, {"name": "allow_pull", "default": null, "required": false, "shortdesc": "Allow pulling non-local images", "type": "boolean", "longdesc": "Allow the image to be pulled from the configured docker registry when\\nthe image does not exist locally. NOTE, this can drastically increase\\nthe time required to start the container if the image repository is \\npulled over the network."}, {"name": "run_opts", "default": null, "required": false, "shortdesc": "run options", "type": "string", "longdesc": "Add options to be appended to the \'docker run\' command which is used\\nwhen creating the container during the start action. This option allows\\nusers to do things such as setting a custom entry point and injecting\\nenvironment variables into the newly created container. Note the \'-d\' \\noption is supplied regardless of this value to force containers to run \\nin the background.\\n\\nNOTE: Do not explicitly specify the --name argument in the run_opts. This\\nagent will set --name using either the resource\'s instance or the name\\nprovided in the \'name\' argument of this agent."}, {"name": "run_cmd", "default": null, "required": false, "shortdesc": "run command", "type": "string", "longdesc": "Specifiy a command to launch within the container once \\nit has initialized."}, {"name": "monitor_cmd", "default": null, "required": false, "shortdesc": "monitor command", "type": "string", "longdesc": "Specifiy the full path of a command to launch within the container to check\\nthe health of the container. This command must return 0 to indicate that\\nthe container is healthy. A non-zero return code will indicate that the\\ncontainer has failed and should be recovered.\\n\\nThe command is executed using nsenter. In the future \'docker exec\' will\\nbe used once it is more widely supported."}, {"name": "force_kill", "default": null, "required": false, "shortdesc": "force kill", "type": "boolean", "longdesc": "Kill a container immediately rather than waiting for it to gracefully\\nshutdown"}, {"name": "reuse", "default": null, "required": false, "shortdesc": "reuse container", "type": "boolean", "longdesc": "Allow the container to be reused after stopping the container. By default\\ncontainers are removed after stop. With the reuse option containers\\nwill persist after the container stops."}], "name": "ocf:heartbeat:docker"}';
      default:
        return {};
    }
  });

  this.del('/attributes/:id');

  this.post('/attributes');
  this.post('/nodes', (schema, request) => {
    var params = JSON.parse(request.requestBody);
    // @note: we have just one cluster with this ID
    params.clusterId = 1;

    return schema.nodes.create(params);
  });

  this.post('/managec/my/update_cluster_settings', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();

    Object.keys(attrs).forEach((i) => {
      schema.db.properties.update({name: i}, {value: attrs[i]});
    });
  });

  this.post('/managec/my/update_fence_device', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    let fenceId;

    if (!('resource_id' in attrs)) {
      // Create new fence agent
      const cluster = schema.clusters.find(1);
      const fence = cluster.createFence({name: attrs._res_paramne_name, agentType: attrs.resource_type});
      fenceId = fence.id;

      delete attrs._res_paramne_name;
    } else {
      fenceId = schema.fences.where({name: attrs.resource_id}).models[0].attrs.id;
    }

    delete attrs.resource_id;
    delete attrs.resource_type;

    Object.keys(attrs).forEach((i) => {
      const cleanName = i.replace(/^_res_paramne_/,"");
      const prop = schema.db.fenceProperties.firstOrCreate({fenceId: fenceId, name:cleanName});
      schema.db.fenceProperties.update(prop['id'], {value: attrs[i]});
    });
  });

  this.post('/managec/my/add_group', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();

    let groupName = attrs['resource_group'];
    let resources = attrs['resources'].split(' ');

    const cluster = schema.clusters.find(1);

    const resource = cluster.createResource({
      name: groupName,
      resourceType: 'group',
    });

    let resIDs = [];
    resources.forEach((x) => {
      if (x === "") { return; }

      let child = schema.resources.where({name: x}).models[0];
      resIDs.push(child);

      // remove resource from parent-cluster; it will be available only via parent-resource
      let ress = [];
      cluster.resources.models.forEach((y) => {
        if (y.attrs.id !== child.id) {
          ress.push(y);
        }
      });
      cluster.resources = ress;
    });
    resource.resources = resIDs;
  });

  this.post('/managec/my/update_resource', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);
    let resourceId;

    if (!('resource_id' in attrs)) {
      // Create new fence agent
      // @todo: proper fix instead of this naive solution that does not work always
      const agentType = attrs.resource_type.split(':');
      const resource = cluster.createResource({
        name: attrs._res_paramne_resourceName,
        resourceType: 'primitive',
        agentType: agentType[agentType.length-1],
        resourceProvider: agentType.slice(0, agentType.length-1).join(':'),
      });
      resourceId = resource.id;

      delete attrs._res_paramne_name;
    } else {
      resourceId = schema.resources.where({name: attrs.resource_id}).models[0].attrs.id;
    }

    if (attrs.resource_clone === 'on') {
      const clonedResource = cluster.createResource({
        name: attrs._res_paramne_resourceName + '-clone',
        resourceType: 'clone',
      });

      clonedResource.resources = [schema.resources.find(resourceId)];

      let ress = [];
      cluster.resources.models.forEach((y) => {
        if (y.attrs.id !== resourceId) {
          ress.push(y);
        }
      });
      cluster.resources = ress;
    }

    if (attrs.resource_ms === 'on') {
      const clonedResource = cluster.createResource({
        name: attrs._res_paramne_resourceName + '-master',
        resourceType: 'masterslave',
      });

      clonedResource.resources = [schema.resources.find(resourceId)];

      let ress = [];
      cluster.resources.models.forEach((y) => {
        if (y.attrs.id !== resourceId) {
          ress.push(y);
        }
      });
      cluster.resources = ress;
    }

    delete attrs.resource_id;
    delete attrs.resource_type;
    delete attrs.resource_clone;

    Object.keys(attrs).forEach((i) => {
      const cleanName = i.replace(/^_res_paramne_/,"");
      const prop = schema.db.resourceProperties.firstOrCreate({resourceId: resourceId, name:cleanName});
      schema.db.resourceProperties.update(prop['id'], {value: attrs[i]});
    });
  });

  this.post('/managec/my/remove_resource', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);

    Object.keys(attrs).forEach((i) => {
      let name = i.substring(6,i.length);
      if (i.startsWith('resid_')) {
        schema.db.resources.remove({name: name});
      } else if (i.startsWith('resid-')) {
        schema.db.fences.remove({name: name});
      }
    });
  });

  this.post('/managec/my/resource_clone', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);

    const clonedResource = cluster.createResource({
      name: attrs.resource_id + '-clone',
      resourceType: 'clone',
    });

    let resIDs = [];
    [attrs.resource_id].forEach((x) => {
      let child = schema.resources.where({name: x}).models[0];
      resIDs.push(child);

      // remove resource from parent-cluster; it will be available only via parent-resource
      let ress = [];
      cluster.resources.models.forEach((y) => {
        if (y.attrs.id !== child.id) {
          ress.push(y);
        }
      });
      cluster.resources = ress;
    });
    clonedResource.resources = resIDs;
  });

  this.post('/managec/my/resource_unclone', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);

    // move children resources to root
    const resource = schema.resources.where({name: attrs.resource_id}).models[0];
    let appendResources = [];
    resource.resources.models.forEach((i) => {
      appendResources.push(i);
    });

    cluster.resources = cluster.resources.models.concat(appendResources);
    schema.db.resources.remove({name: attrs.resource_id});
  });

  this.post('/managec/my/resource_ungroup', function(schema, request) {
    // same code as for resource_unclone - @refactor
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);

    // move children resources to root
    const resource = schema.resources.where({name: attrs.resource_id}).models[0];
    let appendResources = [];
    resource.resources.models.forEach((i) => {
      appendResources.push(i);
    });

    cluster.resources = cluster.resources.models.concat(appendResources);
    schema.db.resources.remove({name: attrs.resource_id});
  });

  this.post('/meta', (schema, request) => {
    const params = JSON.parse(request.requestBody);
    const cluster = schema.clusters.find(1);
    const resource = schema.resources.find(params.data.attributes.resource);

    const attr = resource.createMetaAttribute({
      key: params.data.attributes.key,
      value: params.data.attributes.value
    });

    return attr;
  });

  this.post('/location-preference', (schema, request) => {
    const params = JSON.parse(request.requestBody);
    const cluster = schema.clusters.find(1);
    const resource = schema.resources.find(params.data.attributes.resource);

    const attr = resource.createLocationPreference({
      node: params.data.attributes.node,
      score: params.data.attributes.score
    });

    return attr;
  });
  this.del('/location-preferences/:id');

  this.post('/ordering-preference', (schema, request) => {
    const params = JSON.parse(request.requestBody);
    const cluster = schema.clusters.find(1);
    const resource = schema.resources.find(params.data.attributes.resource);

    const attr = resource.createOrderingPreference({
      resource2: params.data.attributes.resource2,
      action1: params.data.attributes.action1,
      before: params.data.attributes.before,
      action2: params.data.attributes.action2,
      score: params.data.attributes.score,
    });

    return attr;
  });
  this.del('/ordering-preferences/:id');

  this.post('/managec/my/resource_master', function(schema, request) {
    // @todo: refactor; almost same as resource_clone
    const attrs = this.normalizedRequestAttrs();
    const cluster = schema.clusters.find(1);

    const clonedResource = cluster.createResource({
      name: attrs.resource_id + '-master',
      resourceType: 'masterslave',
    });

    let resIDs = [];
    [attrs.resource_id].forEach((x) => {
      let child = schema.resources.where({name: x}).models[0];
      resIDs.push(child);

      // remove resource from parent-cluster; it will be available only via parent-resource
      let ress = [];
      cluster.resources.models.forEach((y) => {
        if (y.attrs.id !== child.id) {
          ress.push(y);
        }
      });
      cluster.resources = ress;
    });
    clonedResource.resources = resIDs;
  });

  this.post('/login', function(schema, request) {
    const attrs = this.normalizedRequestAttrs();

    if ((attrs.identification === 'hacluster') && (attrs.password === 'hacluster')) {
      return new Response(200);
    } else {
      return new Response(400);
    }
  });
  this.get('/logout', () => {
    this.authenticated = false;
    console.log('logout');
  });
  this.get('/login-status', () => {
    if (this.authenticated) {
      return new Response(200);
    } else {
      return new Response(400);
    }
  });
}
