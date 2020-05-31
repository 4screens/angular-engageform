# angular-engageform
==================

4screens angular client for Engageform and Engagenow.

## Installation

Use node@10.5.0+ and npm@6+.

```
npm install
```

## Development

In order to check for type errors, use the task below.
```
npm run check
```

## Distribute

First, build the files using the task below.
```
npm run build
```

Commit the outcome and push it to the master branch.


## Build with Dockerfile

#### 1 Run node:10-alpine container

for osx:
```
dkr -it --rm -v "$(pwd):/workdir:rw" -v /Users:/Users:ro -w /workdir node:10-alpine /bin/sh
```

for Linux:
```
dkr -it --rm -v "$(pwd):/workdir:rw" -v /Home:/Home:ro -w /workdir node:10-alpine /bin/sh
```

`-v /Users:/Users:ro` or `-v /Home:/Home:ro` is required to provide ssh key pairs

#### 2 Install git

```
apk add git
```

#### 3 Install openssh

```
apk add openssh
```

#### 4 Veriry is everything ok

```
git ls-remote -h -t ssh://git@github.com/4screens/util.git
```

if ok then you will see result like below:

```
c74cb04c561b917f9a432cb45afeb74313726f36	refs/heads/master
2d35f47bfe311e7d8acdf12a69c7d70caa6d4fde	refs/tags/v0.1.0
3176d97edf75be106ee5d2e1727d82114473a0fc	refs/tags/v0.1.0^{}
2eb6096d7179f432e216d089fbcdc03fe9676375	refs/tags/v0.1.1
02aa4d05962cf76bc278bb500e8b04a99a304078	refs/tags/v0.1.1^{}
6b786338aa3b6ef19ac4f4ae47dad4fda69e4700	refs/tags/v0.1.10
1d7d1fe33878117c0e56f7226eeae5589e3e1c52	refs/tags/v0.1.11
041f678317cbf14cf9315f1bf0c5297c0442349b	refs/tags/v0.1.2
771129acbbbd09d35423740b541f12c1fd9344ba	refs/tags/v0.1.2^{}
a62f68f29fbadab1233c2ee1a1154751c6d45865	refs/tags/v0.1.3
e72017a44f9b5759c57b42259b9979d846c26eb8	refs/tags/v0.1.3^{}
9174b88b6d563969d23b7758b098589d09f4e1b3	refs/tags/v0.1.4
7547049ae828630c3a0d8b10a01fc82aaa56225d	refs/tags/v0.1.4^{}
4ab583abc6c263701fdef174e963a57109f23fb1	refs/tags/v0.1.5
2ef5ee3bd143d0420863162e595bfe8bea1e8f09	refs/tags/v0.1.6
261c9c5af8ab2d2db4d45e95ad263162c4a24a24	refs/tags/v0.1.6^{}
29cd83bc139b163475ea4f8bf04820a6c95642cf	refs/tags/v0.1.7
fb73afec48b65d5df2cb7f46e4749dbdc02e1b6d	refs/tags/v0.1.8
b689d4580f0df21cf9a2dc60a4ca10817b008abc	refs/tags/v0.1.9
f3dd0956409b647a6452fa64a49bdb191263b0de	refs/tags/v0.2.0
c74cb04c561b917f9a432cb45afeb74313726f36	refs/tags/v0.2.0^{}
``` 

#### 5 Go with npm build commands

```
npm install
npm run check
npm run build
```  
 
