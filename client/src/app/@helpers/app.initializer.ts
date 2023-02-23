import { environment } from 'src/environments/environment';
import { InstagramService } from '../@core';

export function appInitializer(accountService: InstagramService) {
    return () => new Promise<void>(resolve => {
        console.log("here");

        // wait for facebook sdk to initialize before starting the angular app
        window['fbAsyncInit'] = function () {
            FB.init({
                appId: environment.facebookAppId,
                cookie: true,
                xfbml: true,
                version: 'v11.0',
            });

            // auto authenticate with the api if already logged in with facebook
            FB.getLoginStatus(({ authResponse }) => {
                if (authResponse) {
                    console.log("Facebook Auth response", authResponse);

                } else {
                    resolve();
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}