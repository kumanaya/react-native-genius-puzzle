import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, View, FlatList, Pressable, Text } from "react-native";

import Button from "../../components/button";

const Game = () => {

    const [buttonRed, setButtonRed] = useState("#590000");
    const [buttonGreen, setButtonGreen] = useState("#013200");
    const [buttonYellow, setButtonYellow] = useState("#867800");
    const [buttonBlue, setButtonBlue] = useState("#00305C");

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
            color: "#590000"
        },
        {
            id: 1,
            color: "#013200"
        },
        {
            id: 2,
            color: "#867800"
        },
        {
            id: 3,
            color: "#00305C"
        },
    ]

    const COLOR_ACTIVATED = [
        {
            id: 0,
            color: "red"
        },
        {
            id: 1,
            color: "green"
        },
        {
            id: 2,
            color: "yellow"
        },
        {
            id: 3,
            color: "blue"
        },
    ]

    async function resetGame() {
        await new Promise((resolve, reject) => {

            console.log("resetando o jogo")

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
        backgroundColor: "#140E1D",
        flexDirection: "column"
    },
    titleText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
    },
    button: {
        flex: 1,
        height: Dimensions.get('window').width * 0.7,
    }
});