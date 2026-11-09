export type DrawingToolType =
  | 'cursor'
  | 'trendline'
  | 'horizontal_line'
  | 'rectangle'
  | 'fibonacci'
  | 'long_position'
  | 'short_position'
  | 'text'
  | 'measure'
  | 'ellipse'
  | 'vertical_line'
  | 'horizontal_ray';

export interface ChartPoint {
  time: number; // Unix timestamp
  price: number;
}

export interface BaseDrawing {
  id: string;
  type: DrawingToolType;
  symbol: string;
  locked?: boolean;
  color?: string;
  createdAt: number;
}

export interface TrendlineDrawing extends BaseDrawing {
  type: 'trendline';
  p1: ChartPoint;
  p2: ChartPoint;
  width?: number;
  showAngle?: boolean;
}

export interface HorizontalLineDrawing extends BaseDrawing {
  type: 'horizontal_line';
  price: number;
  width?: number;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
}

export interface RectangleDrawing extends BaseDrawing {
  type: 'rectangle';
  p1: ChartPoint;
  p2: ChartPoint;
  fillColor?: string;
  borderColor?: string;
}

export interface FibonacciDrawing extends BaseDrawing {
  type: 'fibonacci';
  p1: ChartPoint;
  p2: ChartPoint;
  levels?: number[];
}

export interface PositionDrawing extends BaseDrawing {
  type: 'long_position' | 'short_position';
  entry: ChartPoint;
  stopLossPrice: number;
  takeProfitPrice: number;
  targetTime?: number;
  riskAmount?: number; // In $
  accountSize?: number;
}

export interface TextDrawing extends BaseDrawing {
  type: 'text';
  point: ChartPoint;
  text: string;
  fontSize?: number;
}

export interface EllipseDrawing extends BaseDrawing {
  type: 'ellipse';
  p1: ChartPoint;
  p2: ChartPoint;
}

export interface VerticalLineDrawing extends BaseDrawing {
  type: 'vertical_line';
  point: ChartPoint;
}

export interface HorizontalRayDrawing extends BaseDrawing {
  type: 'horizontal_ray';
  point: ChartPoint;
}

export interface MeasureDrawing extends BaseDrawing {
  type: 'measure';
  p1: ChartPoint;
  p2: ChartPoint;
}

export type Drawing =
  | TrendlineDrawing
  | HorizontalLineDrawing
  | RectangleDrawing
  | FibonacciDrawing
  | PositionDrawing
  | TextDrawing
  | MeasureDrawing
  | EllipseDrawing
  | VerticalLineDrawing
  | HorizontalRayDrawing;
