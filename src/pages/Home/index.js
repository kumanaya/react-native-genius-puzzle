import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Button from "../../components/button";

const logo = require("../../assets/logo.png");

const Home = () => {

    const navigation = useNavigation();

    function onPressLearnMore() {
        navigation.navigate("Game");
    }

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.main}>
                <Button title="Começar o jogo" onPressed={onPressLearnMore} />
            </View>
        </View >
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#DDDDDD",
    },
    logo: {
        alignSelf: "center"
    },
    main: {
        flex: 1,
        justifyContent: "flex-end",
    },
});