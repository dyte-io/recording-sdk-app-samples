import React, { useEffect, useRef, useState } from "react";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import { DyteGrid, DyteParticipantsAudio, DyteSpinner, defaultConfig } from "@dytesdk/react-ui-kit";
import {
    generateConfig,
    provideDyteDesignSystem,
    UIConfig,
} from "@dytesdk/ui-kit";
import { MeetingConfig } from "../types";

import { DyteRecording } from "@dytesdk/recording-sdk";

const defaultUIConfig = {
    ...defaultConfig,
    designTokens: {
        borderRadius: 'rounded',
        borderWidth: 'thin',
        spacingBase: 4,
        theme: 'dark',
        logo: '',
        colors: {
            brand: {
                '300': '#023dd0',
                '400': '#0248f5',
                '500': '#2160fd',
                '600': '#3e75fd',
                '700': '#5c8afe',
            },
            background: {
                '600': '#222222',
                '700': '#1f1f1f',
                '800': '#1b1b1b',
                '900': '#181818',
                '1000': '#141414',
            },
            danger: '#FF2D2D',
            text: '#EEEEEE',
            'text-on-brand': '#EEEEEE',
            success: '#62A504',
            'video-bg': '#191919',
            warning: '#FFCD07',
        },
    }
}

export default function UIKitMeeting(props: {
    authToken: string;
    config: MeetingConfig;
    baseURI: string | null;
}) {
    const { authToken, config, baseURI } = props;
    const [uiconfig, setuiconfig] = useState<UIConfig | null>(null);
    const [client, initClient] = useDyteClient();
    const [overrides, setOverrides] = useState({});
    const elementRef = useRef(null);

    useEffect(() => {
        if(!authToken){
            return;
        }
        async function setupDyteMeeting(){
            const recordingSDK = new DyteRecording({ });
            const meetingObj = await initClient({
                authToken,
                defaults: {
                    audio: false,
                    video: false,
                },
                baseURI: baseURI ?? 'dyte.io',
            });
            await recordingSDK.init(meetingObj!);
        }
        setupDyteMeeting();

    }, [authToken]);

    useEffect(() => {
        if (client !== undefined) {
            let uiKitConfig = defaultUIConfig as UIConfig;

            if (client.__internals__.features.hasFeature('video_subscription_override')) {
                console.log('enbale video subscription override');
                try {
                    const overrides = JSON.parse(client.__internals__.features.getFeatureValue('video_subscription_override'));
                    const preset = overrides[client.self.organizationId] ?? [];
                    console.log('subscription override', preset);
                    if (preset && preset.length > 0) {
                        setOverrides({ videoUnsubscribed: { preset }});
                    }
                }   catch (error) {
                    console.log(error);
                }
            }

            if (uiKitConfig.root) {
                uiKitConfig.root["dyte-mixed-grid"] = {
                    states: ["activeSpotlight"],
                    children: [
                        ["dyte-simple-grid", { style: { width: "15%" } }],
                    ],
                };

                uiKitConfig.root["dyte-mixed-grid.activeSpotlight"] = [
                    ["dyte-spotlight-grid", { style: { width: "15%" }, layout: "column" }],
                ];
            }
            setuiconfig(uiKitConfig);
        }
    }, [client, config]);

    useEffect(() => {
        if (elementRef.current && uiconfig && uiconfig.designTokens) {
            provideDyteDesignSystem(elementRef.current, uiconfig.designTokens);
        }
    }, [elementRef, uiconfig]);

    if (!client || !uiconfig) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}>
                <DyteSpinner />
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                backgroundColor:
                    "rgba(var(--dyte-colors-background-1000, 8 8 8))",
            }}
            ref={elementRef}
        >
            <DyteGrid
                config={uiconfig}
                meeting={client}
                overrides={overrides}
            />
            <DyteParticipantsAudio meeting={client} />
        </div>
    );
}