import { DyteAvatar, DyteParticipantsAudio, DyteParticipantTile, DyteScreenshareView } from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useState } from "react";

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