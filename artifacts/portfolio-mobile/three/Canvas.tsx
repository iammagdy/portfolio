import { Platform } from "react-native";

const Fiber =
  Platform.OS === "web"
    ? require("@react-three/fiber")
    : require("@react-three/fiber/native");

export const Canvas = Fiber.Canvas;
export const useFrame = Fiber.useFrame;
export const useThree = Fiber.useThree;
