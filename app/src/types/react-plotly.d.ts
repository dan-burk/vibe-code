declare module 'react-plotly.js' {
  import { Component } from 'react'
  import Plotly from 'plotly.js'

  interface PlotParams {
    data: Plotly.Data[]
    layout?: Partial<Plotly.Layout>
    config?: Partial<Plotly.Config>
    frames?: Plotly.Frame[]
    style?: React.CSSProperties
    className?: string
    useResizeHandler?: boolean
    onInitialized?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void
    onUpdate?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void
    onPurge?: (figure: Plotly.Figure, graphDiv: HTMLElement) => void
    onError?: (err: Error) => void
    divId?: string
    onClick?: (event: Plotly.PlotMouseEvent) => void
    onHover?: (event: Plotly.PlotHoverEvent) => void
    onUnhover?: (event: Plotly.PlotMouseEvent) => void
    onSelected?: (event: Plotly.PlotSelectionEvent) => void
    onRelayout?: (event: Plotly.PlotRelayoutEvent) => void
    onRestyle?: (event: Plotly.PlotRestyleEvent) => void
    onRedraw?: () => void
    onAnimated?: () => void
    onAfterPlot?: () => void
    onAnimatingFrame?: (event: Plotly.FrameAnimationEvent) => void
    onAnimationInterrupted?: () => void
    onAutoSize?: () => void
    onBeforeHover?: () => void
    onButtonClicked?: (event: Plotly.ButtonClickEvent) => void
    onClickAnnotation?: (event: Plotly.ClickAnnotationEvent) => void
    onDeselect?: () => void
    onDoubleClick?: () => void
    onFramework?: () => void
    onLegendClick?: (event: Plotly.LegendClickEvent) => boolean | void
    onLegendDoubleClick?: (event: Plotly.LegendClickEvent) => boolean | void
    onSliderChange?: (event: Plotly.SliderChangeEvent) => void
    onSliderEnd?: (event: Plotly.SliderEndEvent) => void
    onSliderStart?: (event: Plotly.SliderStartEvent) => void
    onTransitioning?: () => void
    onTransitionInterrupted?: () => void
    onWebGlContextLost?: () => void
  }

  class Plot extends Component<PlotParams> {}
  export default Plot
}
