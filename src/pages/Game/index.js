import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  Dimensions,
} from 'react-native';

import Sound from 'react-native-sound';

import Button from '../../components/button';

const Game = () => {
  Sound.setCategory('Playback');

  const [buttonRed, setButtonRed] = useState('rgba(95, 0, 0, 0.2)');
  const [buttonGreen, setButtonGreen] = useState('rgba(1, 50, 0, 0.2)');
  const [buttonYellow, setButtonYellow] = useState('rgba(134, 120, 0, 0.2)');
  const [buttonBlue, setButtonBlue] = useState('rgba(0, 48, 92, 0.2)');

  const [sequence, setSequence] = useState([]);
  const [pressed, setPressed] = useState([]);

  const [title, setTitle] = useState('');
  const [score, setScore] = useState(0);

  const [isLocked, setLocked] = useState(false);
  const [isHidden, setHidden] = useState(true);

  var BUTTONS = [
    {
      id: 0,
      color: buttonRed,
    },
    {
      id: 1,
      color: buttonGreen,
    },
    {
      id: 2,
      color: buttonYellow,
    },
    {
      id: 3,
      color: buttonBlue,
    },
  ];

  const COLOR_DISABLED = [
    {
      id: 0,
      color: 'rgba(95, 0, 0, 0.2)',
    },
    {
      id: 1,
      color: 'rgba(1, 50, 0, 0.2)',
    },
    {
      id: 2,
      color: 'rgba(134, 120, 0, 0.2)',
    },
    {
      id: 3,
      color: 'rgba(0, 48, 92, 0.2)',
    },
  ];

  const COLOR_ACTIVATED = [
    {
      id: 0,
      color: '#DC7878',
    },
    {
      id: 1,
      color: '#76D275',
    },
    {
      id: 2,
      color: '#F7E64F',
    },
    {
      id: 3,
      color: '#6EA7DB',
    },
  ];

  function buttonSound(id) {
    var sound = new Sound(`piano_${id}.wav`, Sound.MAIN_BUNDLE, e => {
      if (e) {
        console.log('error', e);
      } else {
        //console.log('duration', sound.getDuration());
        sound.play(() => {
          sound.release();
        });
      }
    });
  }

  function gameOverSound() {
    var sound = new Sound('game_over.wav', Sound.MAIN_BUNDLE, e => {
      if (e) {
        console.log('error', e);
      } else {
        //console.log('duration', sound.getDuration());
        sound.play(() => {
          sound.release();
        });
      }
    });
  }

  function startupSound() {
    var sound = new Sound('startup.wav', Sound.MAIN_BUNDLE, e => {
      if (e) {
        console.log('error', e);
      } else {
        //console.log('duration', sound.getDuration());
        sound.play(() => {
          sound.release();
        });
      }
    });
  }

  async function resetGame() {
    await new Promise((resolve, reject) => {
      setLocked(false);
      setHidden(true);
      setScore(0);

      sequence.length = 0;
      setSequence([]);

      pressed.length = 0;
      setPressed([]);

      resolve();
    });
    initial();
  }

  function verifyPressed() {
    let i = 0;

    let isContinue = true;

    for (let id of pressed) {
      if (id !== sequence[i]) {
        gameOverSound();
        setLocked(true);
        setHidden(false);
        Alert.alert('Game-over', 'Você errou a sequência! Tente novamente');
        setTitle('Game-over');
        isContinue = false;
        break;
      }
      i++;
    }

    if (sequence.length === pressed.length && isContinue) {
      setPressed([]);
      setScore(score + 1);
      getSequence();
    }
  }

  function onButtonPressed(id) {
    if (isLocked === false) {
      buttonTurnOn(id);

      pressed.push(id);

      verifyPressed();
    }
  }

  function buttonTurnOff() {
    setButtonRed(COLOR_DISABLED[0].color);
    setButtonGreen(COLOR_DISABLED[1].color);
    setButtonYellow(COLOR_DISABLED[2].color);
    setButtonBlue(COLOR_DISABLED[3].color);
  }

  async function buttonTurnOn(id) {
    buttonTurnOff();
    switch (id) {
      case 0:
        setButtonRed(COLOR_ACTIVATED[id].color);
        break;
      case 1:
        setButtonGreen(COLOR_ACTIVATED[id].color);
        break;
      case 2:
        setButtonYellow(COLOR_ACTIVATED[id].color);
        break;
      case 3:
        setButtonBlue(COLOR_ACTIVATED[id].color);
        break;
    }
    buttonSound(id);
    await delay(1000);
    buttonTurnOff();
  }

  async function delay(seconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds);
    });
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async function getSequence() {
    setLocked(true);
    setTitle('Atente-se as sequências');

    const nextColor = getRandomNumber(0, 4);
    sequence.push(nextColor);
    setSequence(sequence);

    for (let id of sequence) {
      await delay(2000);
      buttonTurnOn(id);
    }

    await delay(2500);

    setLocked(false);
    setTitle('É a sua vez');
  }

  function initial() {
    startupSound();
    getSequence();
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      initial();
    }
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TitleText = ({text}) => <Text style={styles.titleText}>{text}</Text>;

  const Item = ({id, color}) => (
    <Pressable
      key={id}
      onPress={() => onButtonPressed(id, color)}
      style={styles.pressable}>
      <View style={[styles.button, {backgroundColor: color}]} />
    </Pressable>
  );

  const renderPressalbe = props => {
    let component = [];
    BUTTONS.map((item, index) => {
      component.push(<Item key={index} id={item.id} color={item.color} />);
    });
    return component;
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewScore}>
        <TitleText text={`Score: ${score}`} />
      </View>
      <TitleText text={title} />
      <View style={styles.viewPressable}>{renderPressalbe()}</View>
      {isHidden === true ? (
        <View />
      ) : (
        <Button title="REINICIAR PARTIDA" onPressed={resetGame} />
      )}
    </View>
  );
};

export default Game;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#DDDDDD',
    flexDirection: 'column',
  },
  viewScore: {
    flexDirection: 'row-reverse',
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    color: '#777777',
    textAlign: 'center',
  },
  viewPressable: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 14,
  },
  pressable: {
    padding: 10,
  },
  button: {
    height: (Dimensions.get('screen').width - 60) / 1.6,
    width: (Dimensions.get('screen').width - 60) / 3,
    borderRadius: 20,
  },
});
