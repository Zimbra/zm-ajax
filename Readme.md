## Steps to build
 - ant zm-ajax
 
## Dependencies
- `zm-taglib`
- `zm-store`
- `zm-client`
- `zm-common`
- `ThirdParty Jars`

## Artifacts
- `zmajax.jar`
- `Class files for /src`

## Build Pre-requisite
- create .zcs-deps folder in home directory
- clone zimbra-package-stub at same level: git clone https://github.com/Zimbra/zimbra-package-stub.git 
- clone zm-zcs at same level: git clone ssh://git@stash.corp.synacor.com:7999/zimbra/zm-zcs.git 
- copy folowing jars in /opt/zimbra/lib/jars/ 
    - `gifencoder.jar`