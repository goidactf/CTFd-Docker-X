# CTFd Docker Plugin Fork

### Changes
This a fork of the original docker plugin. Changes that were made:
- Some UI fixies (dark theme support, links near the spawned docker container's ports, fix delayed appearance of the timer, and other).
- Allow to configure some more parameters (alive containers per team/user, revert cooldown, cleanup threshold).
- Some other small bugfixies / improvements.


### About
This plugin for CTFd will allow your competing teams/users to start dockerized images for presented challenges. It adds a challenge type "docker" that can be assigned a specific docker image/tag. A few notable requirements:

* Docker Config must be set first. You can access this via `/admin/docker_config`. Currently supported config is pure http (no encryption/authentication) or full TLS with client certificate validation. Configuration information for TLS can be found here: https://docs.docker.com/engine/security/https/
* This plugin is written so that challenges are stored by tags. For example, StormCTF stores all docker challenges for InfoSeCon2019 in the `stormctf/infosecon2019` repository. A challenge example would be `stormctf/infosecon2019:arbit`. This is how you would call the challenge when creating a new challenge.


## Features
* Allows players to spawn their own docker container for docker challenges.
* Configurable revert timer (default: 3m).
* Configurable stale container nuke (default: 2h).
* Status panel for Admins to manage docker containers currently active.
* Support for client side validation TLS docker API connections (HIGHLY RECOMMENDED).
* Docker container kill on solve.
* (Mostly) Seamless integration with CTFd.


## Installation / Configuration
* Drop the folder `docker_challenges` into `CTFd/CTFd/plugins` (Exactly this name).
* Install the requirements for the plugin: `pip install -r requirements.txt`.
* Restart CTFd.
* Navigate to `/admin/docker_config`. Add your configuration information. Click Submit.
* Click Challenges, Select `docker` for challenge type. Create a challenge as normal, but select the correct docker tag for this challenge.
* Double check the front end shows "Start Docker Instance" on the challenge.
* Confirm users are able to start/revert and access docker challenges.
* Host an awesome CTF!


### Update: 20251110
Works with CTFd 3.7.x - 3.8.1!


#### Credits
See original repo.
