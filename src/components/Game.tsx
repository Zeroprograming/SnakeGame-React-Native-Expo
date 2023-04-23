import * as React from "react";
import {
  NativeEventEmitter,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Colors } from "../styles/colors";
import Header from "./Header";
import { Coordinate, Direction, GestureEventType } from "../types/types";
import Snake from "./Snake";
import { checkGameOver } from "../utils/checkGameOver";
import Food from "./Food";
import { checkEatsFood } from "../utils/checkEatsFood";
import { randomFoodPosition } from "../utils/randomFoodPosition";

// Variables del juego
const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: 5, y: 20 };
const GAME_BOUNDS = { xMin: 0, xMax: 33, yMin: 0, yMax: 61 };
const MOVE_INTERVAL = 50;
const SCORE_INCREMENT = 10;
///////////////////////////////////////////////////////////

export default function Game(): JSX.Element {
  const [direction, setDirection] = React.useState<Direction>(Direction.Right);
  const [snake, setSnake] = React.useState<Coordinate[]>(
    SNAKE_INITIAL_POSITION
  );
  const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION);
  const [isGameOver, setIsGameOver] = React.useState<Boolean>(false);
  const [isPaused, setIsPaused] = React.useState<boolean>(false);
  const [score, setScore] = React.useState<number>(0);

  React.useEffect(() => {
    if (!isGameOver) {
      const interval = setInterval(() => {
        !isPaused && moveSnake();
      }, MOVE_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isGameOver, snake, isPaused]);

  const moveSnake = () => {
    const snakeHead = snake[0];
    const newSnakeHead = { ...snakeHead }; // copia del primer elemento

    // Game Over
    if (checkGameOver(snakeHead, GAME_BOUNDS)) {
      setIsGameOver((prev) => !prev);
      return;
    }

    switch (direction) {
      case Direction.Up:
        newSnakeHead.y--; // -1
        break;
      case Direction.Down:
        newSnakeHead.y++; // +1
        break;
      case Direction.Left:
        newSnakeHead.x--; // -1
        break;
      case Direction.Right:
        newSnakeHead.x++; // +1
        break;
      default:
        break;
    }

    //check eat food

    if (checkEatsFood(newSnakeHead, food, 2)) {
      setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax));
      setSnake([newSnakeHead, ...snake]);
      setScore(score + SCORE_INCREMENT);
    } else {
      setSnake([newSnakeHead, ...snake.slice(0, -1)]); // move Snake
    }
  };

  const handlerGesture = (event: GestureEventType) => {
    const { translationX, translationY } = event.nativeEvent;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 0) {
        setDirection(Direction.Right);
      } else {
        setDirection(Direction.Left);
      }
    } else {
      if (translationY > 0) {
        setDirection(Direction.Down);
      } else {
        setDirection(Direction.Up);
      }
    }
  };

  const reloadGame = () => {
    setSnake(SNAKE_INITIAL_POSITION);
    setFood(FOOD_INITIAL_POSITION);
    setIsGameOver(false);
    setScore(0);
    setDirection(Direction.Right);
    setIsPaused(false);
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };
  return (
    <PanGestureHandler onGestureEvent={handlerGesture}>
      <SafeAreaView style={styles.constainer}>
        <Header
          reloadGame={reloadGame}
          pauseGame={pauseGame}
          isPaused={isPaused}
        >
          <Text
            style={{
              color: Colors.primary,
              fontSize: 22,
              fontWeight: "bold",
            }}
          >
            {score}
          </Text>
        </Header>
        <View style={styles.boundaries}>
          <Snake Snake={snake} />
          <Food x={food.x} y={food.y} />
        </View>
      </SafeAreaView>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  boundaries: {
    flex: 1,
    borderWidth: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderColor: Colors.primary,
    backgroundColor: Colors.background,
  },
});
