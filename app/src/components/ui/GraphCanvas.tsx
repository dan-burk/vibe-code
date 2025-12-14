import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import type { GraphState } from '../../types/components'
import { GRAPH_DEFAULTS, COLORS } from '../../utils/constants'

interface GraphCanvasProps {
  graphState: GraphState
}

interface PlotlyData {
  type: string
  mode?: string
  x: number[]
  y: number[]
  text?: string[]
  textposition?: string
  marker?: {
    size?: number
    color?: string
  }
  line?: {
    color?: string
    width?: number
  }
  name?: string
  hovertemplate?: string
  hoverinfo?: string
}

export default function GraphCanvas({ graphState }: GraphCanvasProps) {
  const { points, lines, functions } = graphState

  // Build Plotly data from graph state
  const plotData = useMemo(() => {
    const data: PlotlyData[] = []

    // Add points
    if (points.length > 0) {
      data.push({
        type: 'scatter',
        mode: 'markers+text',
        x: points.map((p) => p.x),
        y: points.map((p) => p.y),
        text: points.map((p) => p.label || ''),
        textposition: 'top center',
        marker: {
          size: 12,
          color: COLORS.POINT,
        },
        name: 'Points',
        hovertemplate: '(%{x}, %{y})<extra></extra>',
      })
    }

    // Add lines
    lines.forEach((line) => {
      if (line.points.length >= 2) {
        data.push({
          type: 'scatter',
          mode: 'lines',
          x: line.points.map((p) => p[0]),
          y: line.points.map((p) => p[1]),
          line: {
            color: COLORS.LINE,
            width: 2,
          },
          name: 'Line',
          hoverinfo: 'skip',
        })
      }
    })

    // Add functions (as sampled lines)
    functions.forEach((func) => {
      const { xVals, yVals } = evaluateFunction(func.latex)
      data.push({
        type: 'scatter',
        mode: 'lines',
        x: xVals,
        y: yVals,
        line: {
          color: COLORS.FUNCTION,
          width: 2,
        },
        name: func.latex,
        hoverinfo: 'skip',
      })
    })

    return data
  }, [points, lines, functions])

  const layout = {
    xaxis: {
      range: [GRAPH_DEFAULTS.X_MIN, GRAPH_DEFAULTS.X_MAX],
      zeroline: true,
      zerolinecolor: '#374151',
      zerolinewidth: 2,
      gridcolor: COLORS.GRID,
      dtick: 1,
      title: 'x',
    },
    yaxis: {
      range: [GRAPH_DEFAULTS.Y_MIN, GRAPH_DEFAULTS.Y_MAX],
      zeroline: true,
      zerolinecolor: '#374151',
      zerolinewidth: 2,
      gridcolor: COLORS.GRID,
      dtick: 1,
      title: 'y',
      scaleanchor: 'x' as const,
      scaleratio: 1,
    },
    showlegend: false,
    margin: { l: 50, r: 30, t: 30, b: 50 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'white',
    hovermode: 'closest' as const,
  }

  const config = {
    displayModeBar: false,
    responsive: true,
    scrollZoom: true,
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white">
      <Plot
        data={plotData as never[]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '400px' }}
        useResizeHandler
      />
    </div>
  )
}

// Helper function to evaluate a simple function for plotting
function evaluateFunction(latex: string): { xVals: number[]; yVals: number[] } {
  const xVals: number[] = []
  const yVals: number[] = []

  // Parse simple linear functions like "y = 2x + 1" or "y = mx + b"
  // This is a basic implementation - for production, use a math parser

  // Try to extract slope and intercept from "y = mx + b" format
  const linearMatch = latex.match(/y\s*=\s*(-?\d*\.?\d*)?\s*x\s*([+-]\s*\d+\.?\d*)?/)

  if (linearMatch) {
    const m = linearMatch[1] ? parseFloat(linearMatch[1]) || 1 : 1
    const b = linearMatch[2] ? parseFloat(linearMatch[2].replace(/\s/g, '')) : 0

    for (let x = GRAPH_DEFAULTS.X_MIN; x <= GRAPH_DEFAULTS.X_MAX; x += 0.5) {
      xVals.push(x)
      yVals.push(m * x + b)
    }
  } else {
    // Default: just plot y = x
    for (let x = GRAPH_DEFAULTS.X_MIN; x <= GRAPH_DEFAULTS.X_MAX; x += 0.5) {
      xVals.push(x)
      yVals.push(x)
    }
  }

  return { xVals, yVals }
}
