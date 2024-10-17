import { useState, useEffect, useRef } from "react";
import "./componentCSS/emotionBarsComponent.css";
import SingleBarComponent from "./SingleBarComponent";
import Friendly_Olhos from "./Friendly_Olhos/Friendly_Olhos";

const EmotionBarsComponent = ({ onEmotionChange }) => {
  const [angry, setAngry] = useState(0);
  const [disgust, setDisgust] = useState(0);
  const [fear, setFear] = useState(0);
  const [happy, setHappy] = useState(0);
  const [sad, setSad] = useState(0);
  const [surprise, setSurprise] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [emocao, setEmocao] = useState(0);

  const timeout = useRef(undefined);
  useEffect(() => {
    function resetTimeout() {
      let to = timeout.current;
      clearTimeout(to);
      to = setTimeout(() => {
        setAngry(0);
        setDisgust(0);
        setFear(0);
        setHappy(0);
        setSad(0);
        setSurprise(0);
        setNeutral(0);
      }, 3000);
      timeout.current = to;
    }

    function bindEvent() {
      window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    }

    function handleEmotionEvent(evt) {
      resetTimeout();
      const emotions = evt.detail.output.emotion;
      setAngry(emotions.Angry * 100);
      setDisgust(emotions.Disgust * 100);
      setFear(emotions.Fear * 100);
      setHappy(emotions.Happy * 100);
      setSad(emotions.Sad * 100);
      setSurprise(emotions.Surprise * 100);
      setNeutral(emotions.Neutral * 100);

      // Determine the dominant emotion and send it to the parent
      const emotionMap = {
        Neutral: emotions.Neutral,
        Disgust: emotions.Disgust,
        Happy: emotions.Happy,
        Confused: emotions.Surprise, // Mapping Surprise to Confused
        Sad: emotions.Sad,
        Angry: emotions.Angry,
      };

      const dominantEmotion = Object.keys(emotionMap).reduce((a, b) =>
        emotionMap[a] > emotionMap[b] ? a : b
      );

      // Filtragem com base na emoção dominante
      if (dominantEmotion === "Happy") {
        setEmocao(10);
      }else if (dominantEmotion === "Sad") {
        setEmocao(30);
      } else if (dominantEmotion === "Angry") {
        setEmocao(40);
      } else {
        setEmocao(0); // Qualquer outra emoção
      }

      onEmotionChange(dominantEmotion);
      console.log(dominantEmotion)
    }

    bindEvent();
  }, [onEmotionChange]);

  return (
    <>
      <Friendly_Olhos emocao={emocao}></Friendly_Olhos> {/* Pass emotion */}
      <p style={{ fontSize: "20px" }}>EmotionBars Component:</p>
      <div id="emotionsContainer">
        <SingleBarComponent name="Angry" color1="#E21919" color2="#984E4E" value={angry}></SingleBarComponent>
        <SingleBarComponent name="disgust" color1="#37D042" color2="#1A6420" value={disgust}></SingleBarComponent>
        <SingleBarComponent name="Fear" color1="#FF007A" color2="#906490" value={fear}></SingleBarComponent>
        <SingleBarComponent name="Happy" color1="#FFEA00" color2="#8F8A57" value={happy}></SingleBarComponent>
        <SingleBarComponent name="Sad" color1="#6CB4DF" color2="#4E8698" value={sad}></SingleBarComponent>
        <SingleBarComponent name="surprise" color1="#F5B9C3" color2="#664E98" value={surprise}></SingleBarComponent>
        <SingleBarComponent name="Neutral" color1="#A9A9A9" color2="#737373" value={neutral}></SingleBarComponent>
      </div>
    </>
  );
};

export default EmotionBarsComponent;
