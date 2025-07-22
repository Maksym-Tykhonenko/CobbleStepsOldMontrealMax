import React from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const CobbleLoadingComponent = () => {
    const dimensions = Dimensions.get('window');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: transparent;
                overflow: hidden;
            }

            .loader {
                display: block;
                width: 84px;
                height: 84px;
                position: relative;
            }

            .loader:before,
            .loader:after {
                content: "";
                position: absolute;
                left: 50%;
                bottom: 0;
                width: 64px;
                height: 64px;
                border-radius: 50%;
                background: #FFF;
                transform: translate(-50%, -100%) scale(0);
                animation: push_401 2s infinite linear;
            }

            .loader:after {
                animation-delay: 1s;
            }

            @keyframes push_401 {
                0%, 50% {
                    transform: translate(-50%, 0%) scale(1);
                }

                100% {
                    transform: translate(-50%, -100%) scale(0);
                }
            }
        </style>
    </head>
    <body>
        <span class="loader"></span>
    </body>
    </html>
    `;

    return (
        <View style={{
            width: dimensions.width * 0.3,
            height: dimensions.height * 0.15,
            alignSelf: 'center',
            flex: 1,
        }}>
            <WebView
                source={{ html: htmlContent }}
                style={{
                    backgroundColor: 'transparent',
                    flex: 1,
                }}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                bounces={false}
                scalesPageToFit={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                mixedContentMode="compatibility"
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
            />
        </View>
    );
};

export default CobbleLoadingComponent;