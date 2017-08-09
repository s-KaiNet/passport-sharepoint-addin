# Passport.js authentication middleware for SharePoint add-in

### Need help on SharePoint with Node.JS? Join our gitter chat and ask question! [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/sharepoint-node/Lobby)

[Passport.js](http://passportjs.org) authentication strategy for SharePoint Online and SharePoint on-premise performing authentication via ACS.   

This module allows you to perform SharePoint add-in authentication for your Node.js [Express](https://expressjs.com/) web application. Can be also integrated into other connect-based frameworks. 

## Install
```bash
npm install passport-sharepoint-addin
```

## Usage
For detailed in-depth tutorial and configuration workflow please visit sample here - [Express SharePoint add-in sample](https://github.com/s-KaiNet/expressjs-sp-addin).   

### Basic setup  
```javascript
passport.use(new SharePointAddinStrategy({clientId: '', clientSecret: ''}, 'https://site.com/auth/sharepoint/callback', (profile: ISharePointProfile) => {
        return User.findOne({ 'sharepoint.loginName': profile.loginName })
            .then(user => {
                if (user) {
                    return user;
                }

                const newUser = new User();
                newUser.sharepoint.email = profile.email;
                newUser.sharepoint.loginName = profile.loginName;
                newUser.sharepoint.displayName = profile.displayName;
                return newUser.save();
            });
    }));
```