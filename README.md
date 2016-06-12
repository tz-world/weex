# Weex

## Pre-release Notes

Weex is currently in Pre-release Stage.

We agree that you may discuss technical information about Weex, except that you may not fork Weex to public repository , write public reviews or post screen shots using information from current repository(https://github.com/alibaba/weex) , redistribute weex within any form.

 
> A framework for building Mobile cross-platform UI.

Support Android 4.1 (API 16) and iOS 7.0+. See [Weex website](http://alibaba.github.io/weex/) for more information. 

## For Windows

Please ***INSTALL [Git for Windows](https://git-scm.com/download/win)*** and run all the following commands in git-bash.

## Meet Weex

* [Install Playground](http://alibaba.github.io/weex/download.html).

## Use Weex

* See [Tutorial](http://alibaba.github.io/weex/doc/tutorial.html).
* See [Weex Documentation](http://alibaba.github.io/weex/doc/) for more information.

### Android 

0. Prerequisites
    0. Install [Node.js](http://nodejs.org/) 4.0+
    0. Under project root 
        0. `npm install`, install project 
        0. `./start`
    0. Install [Android Environment](http://developer.android.com/training/basics/firstapp/index.html)
0. Run playground, In Android Studio
    0. Open `android/playground`
    0. In `app/java/com.alibaba.weex/WXMainActivity`, modify `CURRENT_IP` to your local IP
    0. Click <img src="http://gtms04.alicdn.com/tps/i4/TB1wCcqMpXXXXakXpXX3G7tGXXX-34-44.png" height="16" > (`Run` button)
0. [Add an example](./examples/README.md#add-an-example)

### iOS
0. Prerequisites
    0. Install [Node.js](http://nodejs.org/) 4.0+
    0. Under project root
        0. `npm install`, install project
        0. `./start`
    0. Install [iOS Environment](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppStoreDistributionTutorial/Setup/Setup.html)
    0. Install [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)
 0. Open `ios/playground`
    0. Run `pod install` in ios/playground
    0. Open `WeexDemo.xcworkspace` in Xcode
    0. Click <img src="http://img1.tbcdn.cn/L1/461/1/5470b677a2f2eaaecf412cc55eeae062dbc275f9" height="16" > (`Run` button) or use default hot key `cmd + r` in xcode
    0. If you want to run demo on your device. In `DemoDefine.h`(you can search this file by Xcode default hot key `cmd+space+o`), modify `CURRENT_IP` to your local IP
0. [Add an example](./examples/README.md#add-an-example)

## Scripts

See [SCRIPTS.md](./SCRIPTS.md) for more information.

## FAQ

See [FAQ](http://alibaba.github.io/weex/doc/faq.html) for more information.

## Contributing

See [Weex Contributing Guide](./CONTRIBUTING.md) for more information.
