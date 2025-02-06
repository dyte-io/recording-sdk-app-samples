import { DyteAvatar, DyteParticipantsAudio, DyteParticipantTile, DyteScreenshareView } from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect, useState } from "react";

export default function RecordingView() {
    const { meeting } = useDyteMeeting();

    const [size] = useState({ height: '120px', width: '120px' });

    const activeParticipants = useDyteSelector((meeting) =>
        meeting.participants.active.toArray()
    );

    const pinnedParticipants = useDyteSelector((meeting) =>
        meeting.participants.pinned.toArray()
    );

    const screensharedParticipants = useDyteSelector((meeting) =>
        meeting.participants.joined.toArray().filter((p) => p.screenShareEnabled)
    );

    // show pinned participants first
    const participants = [
        ...pinnedParticipants,
        ...activeParticipants.filter((p) => !pinnedParticipants.includes(p)),
    ];

    const hasScreenshare = screensharedParticipants.length > 0;

    useEffect(() => {
        if(!meeting){
            return;
        }

        const captureParticipantSnapshotAndPost = async () => {
            const participants = meeting.participants.active.toArray().filter((e) => e.videoEnabled && e.presetName && e.presetName.indexOf(import.meta.env.VITE_PRESET_NAME_FOR_THUMBNAIL) > -1);
            const canvasElement = document.createElement('canvas');
		    const videoElement = document.createElement('video');

            for(let participant of participants){
                try{
                    const track = participant.videoTrack;
                    const stream = new MediaStream();
                    stream.addTrack(track);

                    videoElement.srcObject = stream;
		            videoElement.autoplay = true;
                    videoElement.muted = true;

                    try {
                        await videoElement.play();
                    } catch (ex) {
                        // Ignore
                    }

                    const canvasCtx = canvasElement.getContext('2d');

                    const trackSettings = track.getSettings();
                    const width = trackSettings?.width ?? 1920;
                    const height = trackSettings?.height ?? 1080;

                    videoElement.height = height;
                    videoElement.width = width;
                    canvasElement.width = width;
                    canvasElement.height = height;
                    canvasCtx!.drawImage(videoElement, 0, 0, width, height);
                    
                    const dataURL = canvasElement!.toDataURL("image/jpeg")
                    
                    /**
                     * NOTE(ravindra-dyte): alter the body params as per your need.
                     * Below is just a sample
                     */
                    await fetch(import.meta.env.VITE_THUMBNAIL_POST_ENDPOINT, {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "room_sid": meeting.meta.meetingId,
                            "file_content": dataURL
                        }),
                    });

                }catch{
                    // For now, do nothing
                }
            }
        }

        let intervalId = setInterval(async () => {
            await captureParticipantSnapshotAndPost();
        }, +import.meta.env.VITE_THUMBNAIL_TIME_INTERVAL);

        return () => {
            clearTimeout(intervalId);
        }
    }, [meeting]);

    return (<main
        style={{
            display: "flex",
            position: "relative",
            paddingTop: "0rem",
            flexWrap: "wrap",
            flexShrink: "0",
            justifyContent: "center",
            alignContent: "center",
            width: "100vw",
            height: "100vh"
        }}
    >
        {hasScreenshare && (
            <DyteScreenshareView
                meeting={meeting}
                participant={screensharedParticipants[0]}
                hideFullScreenButton={true}
            />
        )}
        <div
            style={{
                height: `calc(${size.height} + 1.25rem)`,
                display: "flex",
                position: "fixed",
                bottom: "0",
                zIndex: "10",
                paddingLeft: "2.5rem",
                paddingRight: "2.5rem",
                verticalAlign: "middle",
                justifyContent: "flex-start",
                width: "100%",
                gap: "1rem",
                marginLeft:"2rem"
            }}
        >
            {participants.map((participant) => {
                return (
                    <div
                        key={participant.id}
                        style={{ ...size, borderRadius: "9999px" }}
                    >
                        <DyteParticipantTile
                            meeting={meeting}
                            participant={participant}
                            key={participant.id}
                            style={{
                                ...size,
                                transitionProperty: "all",
                                borderRadius: "9999px",
                                borderWidth: "1px",
                            }}
                        >
                            <DyteAvatar participant={participant} />
                        </DyteParticipantTile>
                    </div>
                );
            })}
        </div>
        <DyteParticipantsAudio meeting={meeting} />
    </main>)
}