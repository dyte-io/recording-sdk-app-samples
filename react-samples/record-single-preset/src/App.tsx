import { useEffect } from "react";
import { DyteProvider, useDyteClient } from "@dytesdk/react-web-core";
import RecordingView from "./components/RecordingView";
import { DyteRecording } from "@dytesdk/recording-sdk";

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    async function setupDyteMeeting(){
      const searchParams = new URL(window.location.href).searchParams;
  
      const authToken = searchParams.get("authToken");
  
      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
        );
        return;
      }
  
      const baseURI = searchParams.get('baseURI');
  
      const recordingSDK = new DyteRecording({ });
      const meetingObj = await initMeeting({
        authToken,
        defaults: {
          video: false,
          audio: false,
        },
        baseURI: baseURI ?? "dyte.io",
      });
      if (!meetingObj) {
        return;
      }
      await recordingSDK.init(meetingObj);
    }
    if(!meeting){
      setupDyteMeeting();
    }
  }, [meeting]);

  Object.assign(window, { meeting });

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider value={meeting} fallback={<div>Loading...</div>}>
      <RecordingView />
    </DyteProvider>
  );
}

export default App;
