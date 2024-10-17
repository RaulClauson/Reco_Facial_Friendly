import './Friendly_Olhos.css';
import { useRive, Layout, Fit, Alignment, useStateMachineInput } from '@rive-app/react-canvas';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';

const STATE_MACHINE_NAME = 'State Machine 1';  // Seu nome da máquina de estados
const NUM_X_INPUT = 'NumX';  // Entrada para o X
const NUM_Y_INPUT = 'NumY';  // Entrada para o Y
const EMOCAO_INPUT = 'Emocao'; // Entrada para estado emocional
const CLICK_INPUT_NAME = 'Click'; // Entrada para gatilho de estado

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

const Friendly_Olhos = forwardRef(({ emocao }) => {
  console.log(emocao)
  const { rive, RiveComponent } = useRive({
    src: '/Animations.riv',  // Caminho para o arquivo .riv
    stateMachines: STATE_MACHINE_NAME,  // Nome da máquina de estados
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  const [isFollowing, setIsFollowing] = useState(false); // Acompanhar ou não
  const [isMobile, setIsMobile] = useState(false); // Detectar se é um dispositivo móvel
  const [timer, setTimer] = useState(null); // Timer para parar de seguir

  const targetX = useRef(50); // Iniciar no centro (50%)
  const targetY = useRef(50); // Iniciar no centro (50%)
  const currentX = useRef(50); // Posição X interpolada atual
  const currentY = useRef(50); // Posição Y interpolada atual

  const numXInput = useStateMachineInput(rive, STATE_MACHINE_NAME, NUM_X_INPUT);
  const numYInput = useStateMachineInput(rive, STATE_MACHINE_NAME, NUM_Y_INPUT);
  const emocaoInput = useStateMachineInput(rive, STATE_MACHINE_NAME, EMOCAO_INPUT);

    // Atualiza a animação com base na emoção
    useEffect(() => {
      if (emocaoInput && emocao !== undefined) {
        emocaoInput.value = emocao; // Define o valor da entrada Emocao baseado no valor recebido do componente pai
        console.log(`Emotion changed to: ${emocao}`);
      }
    }, [emocao, emocaoInput]);

  // Handler de movimento do mouse para desktop
  const handleMouseMove = (event) => {
    if (!isMobile && isFollowing) {
      const friendlyOlhosDiv = document.getElementById('Friendly_Olhos');
      if (friendlyOlhosDiv) {
        const rect = friendlyOlhosDiv.getBoundingClientRect();

        if (event.clientX >= rect.left && event.clientX <= rect.right &&
            event.clientY >= rect.top && event.clientY <= rect.bottom) {

          targetX.current = ((event.clientX - rect.left) / rect.width) * 100;
          targetY.current = (1 - (event.clientY - rect.top) / rect.height) * 100;
        }
      }
    }
  };

  // Handler de orientação do dispositivo para mobile
  const handleDeviceOrientation = (event) => {
    if (isMobile && isFollowing) {
      const maxTilt = 90; // Ângulo máximo de inclinação

      // Normaliza os valores de inclinação para a faixa de 0-100
      targetX.current = ((event.gamma || 0) + maxTilt) / (2 * maxTilt) * 100;
      targetY.current = ((event.beta || 0) + maxTilt) / (2 * maxTilt) * 100;
    }
  };

  const updatePosition = () => {
    if (numXInput && numYInput) {
      currentX.current = lerp(currentX.current, targetX.current, 0.1); // Fator de suavização (0.1)
      currentY.current = lerp(currentY.current, targetY.current, 0.1);

      numXInput.value = currentX.current;
      numYInput.value = currentY.current;

      if (emocaoInput) {
        emocaoInput.value = emocao; // Define o valor da entrada Emocao
      }
    }
  };

  useEffect(() => {
    const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(isMobileDevice);

    if (isMobileDevice) {
      // Escuta orientação do dispositivo no mobile
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    } else {
      // Escuta movimento do mouse no desktop
      window.addEventListener('mousemove', handleMouseMove);
    }

    const intervalId = setInterval(updatePosition, 16); // Atualização a 60 FPS

    return () => {
      if (isMobileDevice) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      } else {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      clearInterval(intervalId);
    };
  }, [isFollowing, numXInput, numYInput, emocaoInput, emocao]);

  const clickInput = useStateMachineInput(rive, STATE_MACHINE_NAME, CLICK_INPUT_NAME);

  const handleClick = () => {
    if (clickInput) {
      clickInput.fire();
    }

    if (!isFollowing) {
      setIsFollowing(true);
      if (timer) {
        clearTimeout(timer);
      }
      const newTimer = setTimeout(() => {
        setIsFollowing(false);
        targetX.current = 50;
        targetY.current = 50;
      }, 10000);

      setTimer(newTimer);
    }
  };

  return (
    <div id="Friendly_Olhos" onClick={handleClick}>
      <RiveComponent />
    </div>
  );
});

export default Friendly_Olhos;
