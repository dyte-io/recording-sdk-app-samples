import {
  DyteMixedGrid,
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect } from "react";

const TARGET_PRESET = "LEAD";

export default function RecordingView() {
  const { meeting } = useDyteMeeting();

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  const targetParticipants = joinedParticipants.filter(
    (participant) => participant.presetName === TARGET_PRESET
  );

  const screensharedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray().filter((p) => p.screenShareEnabled)
  );

  const hasScreenshare = screensharedParticipants.length > 0;

  useEffect(() => {
    // Ideally there should be just one participant with the preset name "LEAD"
    // Comment out if you don't want to pin the peer
    // for (const participant of targetParticipants) {
    //   participant.pin();
    // }
  }, [targetParticipants]);

  return (
    <main
      style={{
        display: "flex",
        position: "relative",
        paddingTop: "0rem",
        flexWrap: "wrap",
        flexShrink: "0",
        justifyContent: "center",
        alignContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {hasScreenshare ? (
        <DyteMixedGrid
          participants={targetParticipants}
          pinnedParticipants={targetParticipants}
          screenShareParticipants={screensharedParticipants}
          plugins={[]}
          meeting={meeting}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        />
      ) : (
        <DyteSimpleGrid
          meeting={meeting}
          participants={targetParticipants}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        />
      )}

      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}
