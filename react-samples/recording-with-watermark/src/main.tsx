import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Meeting from './pages/RecordingPage';
import reportWebVitals from './reportWebVitals';
import DyteClient from "@dytesdk/web-core";


declare global {
  interface Window {
      triggerDyteRecording: boolean;
      dyteRecording?: {
          getParticipantCount: () => number;
          isMeetingEnded: () => boolean;
          isMeetingJoined: () => boolean;
          getMeeting: () => DyteClient;
      }
  }
}

window.triggerDyteRecording = true;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/meeting/stage/:roomName" element={<Meeting />} />
    <Route path="/" element={<Meeting />} />
  </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();