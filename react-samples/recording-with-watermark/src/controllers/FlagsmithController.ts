import axios, { AxiosInstance } from "axios";
import { globalFlagsmith as flagsmith } from '@dyteinternals/utils';

export enum FlagsmithFeatureFlags {
    QUICK_ZOOM = 'quick_zoom',
    INTERNAL_CALL_STATS = 'internal_call_stats',
    CFWS = 'cfws',
    LOGROCKET = 'logrocket',
    SIMULCAST = 'simulcast',
    CHAT_SOCKET_SERVER = 'chat_socket_server',
    PLUGIN_SOCKET_SERVER = 'plugin_socket_server',
    DEV_MODE_PLUGINS = 'dev_mode_plugins',
    NR_OTEL_WEB = 'nr_otel_web',
    FEAT_SPOTLIGHT = 'feat_spotlight',
    UIKIT_RECORDING = 'uikit_recording',
    WAIT_TIME_MS = "wait_time_ms_recording"
}

export default class FlagsmithController {
    requests: AxiosInstance;
    roomName: string;
    organizationId!: string;
    participantId!: string;


    constructor(authToken: string, roomName: string , apiBase: string | null) {
        this.requests = axios.create({
            baseURL: apiBase ?? 'https://api.cluster.dyte.in',
            timeout: 5000,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        this.roomName = roomName;
    }

    async init() {
        if (!this.roomName) {
            // V2 Meeting
            const res = await this.requests.get('/v2/internals/participant-details');
            this.organizationId = res?.data?.data?.participant?.organization_id;
            this.participantId = res?.data?.data?.participant?.id;

        } else {
            // V1 Meeting
            const res = await this.requests.get('/auth/basicUserDetails');
            this.organizationId = res?.data?.user?.organizationId;
            this.participantId = res?.data?.user?.id;
        }

        const randomString = Math.random().toString(36).substring(2,7);
        await flagsmith.identify(`recorder_${this.participantId}_${randomString}`, {
            roomName: this.roomName,
            organizationId: this.organizationId,
        });
    }

    useUiKit() {
        return flagsmith.hasFeature(FlagsmithFeatureFlags.FEAT_SPOTLIGHT) ||
            flagsmith.hasFeature(FlagsmithFeatureFlags.UIKIT_RECORDING);
    }

    getWaitTimeMS() {
        return parseInt(flagsmith.getValue(FlagsmithFeatureFlags.WAIT_TIME_MS) || '0', 10);
    }
}