import { Fragment } from "react";
import { StyleSheet,View } from "react-native";
import { Coordinate } from "../types/types";
import { Colors, ColorsList } from "../styles/colors";


interface SnakeProps {
    Snake: Coordinate[];
};

export default function Snake({ Snake }: SnakeProps): JSX.Element {
    const randomColorIndex = Math.floor(Math.random() * ColorsList.length); // Generar un índice aleatorio para la lista de colores
    const randomColor = ColorsList[randomColorIndex]; // Obtener el color aleatorio correspondiente
  
    return (
        <Fragment>
            {
                Snake.map((segment: any, index: number) => {
                    const segmentStyle = {
                        left: segment.x * 10, // adjuste size of each segment
                        top: segment.y * 10,
                    };
                    return <View key={index} style={[styles.snake, segmentStyle, { backgroundColor: randomColor }]} />
                })
            }
        </Fragment>
    )
} 

const styles = StyleSheet.create({ 
    snake: {
      width: 15,
      height: 15,
      borderRadius: 7,
      position: 'absolute',
    },
});