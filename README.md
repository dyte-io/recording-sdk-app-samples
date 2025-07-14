# RealtimeKit SDK Recording App Samples 

This repository consists of recording sample apps created using RealtimeKit Recording SDK, our Core SDKs, and, fully customizeable UI kits.

Guide: https://docs.realtime.cloudflare.com/guides/recording/create-record-app-using-sdks

## Samples

Here are a few available samples.

1. React samples
  A. recording-with-watermark <br>
  B. screenshare-focused <br>
  C. screenshare-focused-with-snapshot-capture <br>
  D. record-single-preset <br>

## Usage

To use these samples you would need to do the following steps:

First, you'll need to create a meeting and add a participant to that meeting.

You can do so by going to https://docs.realtime.cloudflare.com/api?v=v2 and run the APIs in the
API runner itself so you can quickly get started.

Make sure you've created your RealtimeKit account at https://dev.realtime.cloudflare.com and have your
`Organization ID` and `API Key` ready to use from the
[API Keys section](https://dev.realtime.cloudflare.com/apikeys).

1. Go to
   [Create Meeting API](https://docs.realtime.cloudflare.com/api/?v=v2#/operations/create_meeting)
   and add your credentials and run the API with your request body, note the
   `id` you receive in resonse, this is the meeting id.
2. Go to
   [Add Participant API](https://docs.realtime.cloudflare.com/api/?v=v2#/operations/add_participant)
   and add a participant to the meeting with the `meetingId` you received in
   previous API call.

Once you're done, you'll get an `authToken`, which you can use in a sample as
explained below.

### Trying out a sample

Here are steps to try out the samples:

1. Clone the repo:

```sh
git clone git@github.com:dyte-io/recording-sdk-app-samples.git
```

2. Change directory to the sample you want to try, for example: to use recording-with-watermark react-sample use the following command:

```sh
cd react-samples/recording-with-watermark
```

3. Install the packages with your preferred package manager and start a
   development server and open up the page.

```sh
npm install
# and to start a dev server
npm run dev
```

4. Load the dev server in your browser and make sure you pass the `authToken`
   query in the URL.

```
http://localhost:5173/?authToken=<your-token>
```
5. Deploy your app using Vercel.

```sh
npm install -g vercel
vercel
```
