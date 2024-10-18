import { useEffect, useRef, useState } from "react";
import { useExternalScript } from "./helpers/ai-sdk/externalScriptsLoader";
import { getAiSdkControls } from "./helpers/ai-sdk/loader";

import './App.css';

import GenderComponent from "./components/GenderComponent";
import AgeComponent from "./components/AgeComponent";
import DominantEmotionComponent from "./components/DominantEmotionComponent";
import FeatureComponent from "./components/FeatureComponent";
import EngagementComponent from "./components/EngagementComponent";
import FaceTrackerComponent from "./components/FaceTrackerComponent";
import MoodComponent from "./components/MoodComponent";
import EmotionBarsComponent from "./components/EmotionBarsComponent";

function App() {
  const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
  const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
  const videoEl = useRef(undefined);

  const [emotion, setEmotion] = useState(0); // Holds the current emotion

  useEffect(() => {
    videoEl.current = document.getElementById("videoEl");
    async function getAiSdk() {
      if (aiSdkState === "ready" && mphToolsState === "ready") {
        const { source, start } = await getAiSdkControls();
        await source.useCamera({
          toVideoElement: document.getElementById("videoEl"),
        });
        await start();
      }
    }
    getAiSdk();
  }, [aiSdkState, mphToolsState]);

  // Map dominant emotion to the corresponding Rive value (0-40)
  const handleEmotionChange = (dominantEmotion) => {
    const emotionMap = {
      Neutral: 0,
      Happy: 10,
      Confused: 20, // Mapping 'Surprise' to 'Confused'
      Sad: 30,
      Angry: 40,
    };
    setEmotion(emotionMap[dominantEmotion] || 0);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="video">
            <video id="videoEl"></video>
            <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
          </div>
{/*           <GenderComponent></GenderComponent>
          <hr className="solid" style={{ width: "100%" }}></hr> */}
{/*           <DominantEmotionComponent></DominantEmotionComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <AgeComponent></AgeComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <FeatureComponent></FeatureComponent>
          <hr className="solid" style={{ width: "100%" }}></hr>
          <EngagementComponent></EngagementComponent>
          <hr className="solid" style={{ width: "100%" }}></hr> */}
{/*           <MoodComponent></MoodComponent>
          <hr className="solid" style={{ width: "100%" }}></hr> */}
          <EmotionBarsComponent onEmotionChange={handleEmotionChange}></EmotionBarsComponent>
{/*           <hr className="solid" style={{ width: "100%" }}></hr> */}
        </div>
      </header>
    </div>
  );
}

export default App;
