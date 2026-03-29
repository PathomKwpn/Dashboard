declare module "react-simple-maps" {
  import type { ReactNode, CSSProperties, MouseEvent, SVGProps } from "react";

  export interface ProjectionConfig {
    scale?:   number;
    center?:  [number, number];
    rotate?:  [number, number, number];
  }

  export interface ComposableMapProps {
    projection?:       string;
    projectionConfig?: ProjectionConfig;
    width?:            number;
    height?:           number;
    style?:            CSSProperties;
    className?:        string;
    children?:         ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children:  (args: { geographies: Geography[] }) => ReactNode;
  }

  export interface Geography {
    rsmKey:     string;
    type:       string;
    properties: Record<string, unknown>;
    geometry:   object;
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: Geography;
    fill?:     string;
    stroke?:   string;
    strokeWidth?: number;
    style?: {
      default?: CSSProperties & SVGProps<SVGPathElement>;
      hover?:   CSSProperties & SVGProps<SVGPathElement>;
      pressed?: CSSProperties & SVGProps<SVGPathElement>;
    };
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?:   ReactNode;
    className?:  string;
    style?:      CSSProperties;
    onMouseEnter?: (event: MouseEvent<SVGGElement>) => void;
    onMouseLeave?: (event: MouseEvent<SVGGElement>) => void;
    onClick?:      (event: MouseEvent<SVGGElement>) => void;
  }

  export const ComposableMap: (props: ComposableMapProps) => JSX.Element;
  export const Geographies:   (props: GeographiesProps)   => JSX.Element;
  export const Geography:     (props: GeographyProps)     => JSX.Element;
  export const Marker:        (props: MarkerProps)        => JSX.Element;
}
