import React from "react";
import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import { Canvas as RawCanvas } from "./Canvas";

function hasWebGL(): boolean {
  if (Platform.OS !== "web") return true;
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

const WEBGL_OK = hasWebGL();

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  camera?: { position: [number, number, number]; fov: number };
  dpr?: number | [number, number];
  gl?: Record<string, unknown>;
}

interface State {
  failed: boolean;
}

export default class SafeCanvas extends React.Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) console.warn("[SafeCanvas] WebGL/R3F failed:", error.message);
  }

  render() {
    if (this.state.failed || !WEBGL_OK) {
      return <View style={[styles.fallback, this.props.style]} />;
    }
    try {
      return (
        <RawCanvas
          style={this.props.style}
          camera={this.props.camera}
          dpr={this.props.dpr ?? [1, 2]}
          gl={this.props.gl ?? { antialias: true, alpha: true }}
          onCreated={({ gl }: { gl: { setClearColor?: (c: string, a?: number) => void } }) => {
            gl.setClearColor?.("#000000", 0);
          }}
        >
          {this.props.children}
        </RawCanvas>
      );
    } catch {
      return <View style={[styles.fallback, this.props.style]} />;
    }
  }
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "transparent",
  },
});
