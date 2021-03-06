import React from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';

const Button = ({title, onPressed}) => {
  return (
    <Pressable onPress={onPressed} style={styles.button}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#B7B7B7',
    backgroundColor: 'rgba(52, 52, 52, alpha)',
  },
  title: {
    color: '#777777',
    textTransform: 'uppercase',
  },
});
