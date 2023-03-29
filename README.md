## Setup

- yarn install
- update `App.vue` -> `ONESIGNAL_APP_ID` value
- yarn build
- yarn sync

- open open ios/App/App.xcworkspace
- update Signing
- Run it


## Reproduce on iOS

### More than 100 tags ❌
1. [Init] ✅
2. [Send 101 tags] --> call send api 2 times ✅
3. [Get tags] --> tags.length = 0 ❌

![More than 100 tags](/docs/2.PNG)


### Less than 100 tags ✅
1. [Init] ✅
2. [Send 100 tags]
3. [Get tags] --> tags.length = 100 ✅
4. [Reset] -> call delete api 2 times --> tags.length = 0 ✅

![Less than 100 tags](/docs/1.PNG)

### Less than 100 tags then increment add more ✅
1. [Init] ✅
2. [Send 100 tags]
3. [Get tags] --> tags.length = 100 ✅
4. [Send 101 tags] --> call send api 1 time -> only send 1 tag (increment) ✅
5. [Get tags] --> tags.length = 101 ✅


### Less than 100 tags then increment add more finally delete all ❌
1. [Init] ✅
2. [Send 100 tags]
3. [Get tags] --> tags.length = 100 ✅
4. [Send 101 tags] --> call send api 1 time -> only send 1 tag (increment) ✅
5. [Get tags] --> tags.length = 101 ✅
6. [Reset] -> call delete api 2 times --> tags.length = 101 ❌

![Less than 100 tags then increment add more finally delete all](/docs/3.PNG)