import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, FlatList, Pressable, Text } from "react-native";

import Sound from "react-native-sound";

import Button from "../../components/button";

const Game = () => {

    // Enable playback in silence mode
    Sound.setCategory('Playback');

    const [buttonRed, setButtonRed] = useState("rgba(95, 0, 0, 0.2)");
    const [buttonGreen, setButtonGreen] = useState("rgba(1, 50, 0, 0.2)");
    const [buttonYellow, setButtonYellow] = useState("rgba(134, 120, 0, 0.2)");
    const [buttonBlue, setButtonBlue] = useState("rgba(0, 48, 92, 0.2)");

    const [sequence, setSequence] = useState([]);
    const [pressed, setPressed] = useState([]);
    const [score, setScore] = useState(0);

    const [isPlay, setPlaying] = useState(false);
    const [isHidden, setHidden] = useState(true);

    const [title, setTitle] = useState("");

    var BUTTONS = [
        {
            id: 0,
            color: buttonRed
        },
        {
            id: 1,
            color: buttonGreen
        },
        {
            id: 2,
            color: buttonYellow
        },
        {
            id: 3,
            color: buttonBlue
        },
    ]

    const COLOR_UNABLED = [
        {
            id: 0,
            color: "rgba(95, 0, 0, 0.2)"
        },
        {
            id: 1,
            color: "rgba(1, 50, 0, 0.2)"
        },
        {
            id: 2,
            color: "rgba(134, 120, 0, 0.2)"
        },
        {
            id: 3,
            color: "rgba(0, 48, 92, 0.2)"
        },
    ]

    const COLOR_ACTIVATED = [
        {
            id: 0,
            color: "#DC7878"
        },
        {
            id: 1,
            color: "#76D275"
        },
        {
            id: 2,
            color: "#F7E64F"
        },
        {
            id: 3,
            color: "#6EA7DB"
        },
    ]

    function buttonSound(id) {
        var sound = new Sound(`piano_${id}.wav`, Sound.MAIN_BUNDLE, () => {
            sound.setVolume(100);
            sound.play();
        });
    }

    function gameOverSound() {
        var sound = new Sound('game_over.wav', Sound.MAIN_BUNDLE, () => {
            sound.play();
        });
    }

    function startupSound() {
        var sound = new Sound('startup.wav', Sound.MAIN_BUNDLE, () => {
            sound.play();
        });
    }

    async function resetGame() {
        await new Promise((resolve, reject) => {

            console.log("resetando o jogo")

            setPlaying(false);

            sequence.length = 0;
            setSequence([]);

            pressed.length = 0;
            setPressed([]);

            setHidden(true);

            setScore(0);
            resolve();
        });
        initial();
    }

    async function verifyPressed() {

        let i = 0;

        let isContinue = true;

        for (let id of pressed) {
            if (id !== sequence[i]) {
                setPlaying(true);
                gameOverSound();
                alert("Você errou a sequência! Tente novamente");
                setTitle("Tente novamente");
                setHidden(false);
                isContinue = false;
                break;
            }
            i++
        }

        if (sequence.length === pressed.length && isContinue) {
            setPressed([]);
            setScore(score + 1);
            getSequence();
        };

    }


    function onButtonPressed(id, color) {

        //alert("id: " + id + " cor: " + color);

        if (isPlay === false) {

            buttonTurnOn(id);

            pressed.push(id);

            verifyPressed();
        }

    }

    async function buttonTurnOff() {
        setButtonRed(COLOR_UNABLED[0]["color"]);
        setButtonGreen(COLOR_UNABLED[1]["color"]);
        setButtonYellow(COLOR_UNABLED[2]["color"]);
        setButtonBlue(COLOR_UNABLED[3]["color"]);
    }
    async function buttonTurnOn(id) {
        buttonTurnOff();
        switch (id) {
            case 0:
                setButtonRed(COLOR_ACTIVATED[id]["color"]);
                break;
            case 1:
                setButtonGreen(COLOR_ACTIVATED[id]["color"]);
                break;
            case 2:
                setButtonYellow(COLOR_ACTIVATED[id]["color"]);
                break;
            case 3:
                setButtonBlue(COLOR_ACTIVATED[id]["color"]);
                break;
        }
        buttonSound(id);
        await timer(1000);
        buttonTurnOff();
    }

    async function timer(seconds) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, seconds)
        });
    }

    function getRandomNumber(min, max) {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    }

    function debug() {
        console.log("=== PLAYING === ");
        console.log("score : " + score);
        console.log("sequencia: " + sequence)
    }

    async function getSequence() {

        setPlaying(true);
        setTitle("Atente-se as sequências");

        const nextColor = getRandomNumber(0, 4);
        sequence.push(nextColor);
        setSequence(sequence);

        debug();

        for (let id of sequence) {
            await timer(3500);
            buttonTurnOn(id);
        }

        await timer(2500);

        setPlaying(false);
        setTitle("É a sua vez");

    }

    function initial() {
        startupSound();
        getSequence();
    }

    useEffect(() => {
        initial();
    }, []);

    const TitleText = ({ text }) => (
        <Text style={styles.titleText}>{text}</Text>
    );

    const Item = ({ id, color }) => (
        <Pressable key={id} onPress={() => onButtonPressed(id, color)} style={{ flex: 1, padding: 10 }}>
            <View style={[styles.button, { backgroundColor: color }]} />
        </Pressable>
    );

    const renderItem = ({ item }) =>
    (
        <Item id={item.id} color={item.color} />
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row-reverse", paddingBottom: 10 }}>
                <TitleText text={`Score: ${score}`} />
            </View>
            <TitleText text={title} />
            <FlatList
                data={BUTTONS}
                renderItem={renderItem}
                numColumns={2}
                key={item => item.id} />
            {
                isHidden === true ? <View /> : <Button title="REINICIAR PARTIDA" onPressed={resetGame} />
            }
        </View >
    )
}

export default Game;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#DDDDDD",
        flexDirection: "column"
    },
    titleText: {
        fontSize: 20,
        color: "#777777",
        textAlign: "center",
    },
    button: {
        flex: 1,
        height: Dimensions.get('window').width * 0.7,
        borderRadius: 20,
    }
});