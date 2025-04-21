import React, { useEffect, useRef } from 'react';
import styles from '../styles/Chart.module.css';

interface ChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      color: string;
    }>;
  };
}

export function Chart({ data }: ChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw chart
    drawChart(ctx, data, canvas.width, canvas.height);
    
    // Add legend
    drawLegend(ctx, data.datasets, canvas.width, canvas.height);
  }, [data, canvasRef]);
  
  return (
    <div className={styles.chartWrapper}>
      <canvas ref={canvasRef} className={styles.chart} />
    </div>
  );
}

function drawChart(
  ctx: CanvasRenderingContext2D,
  data: ChartProps['data'],
  width: number,
  height: number
) {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 30; // Extra space for legend
  
  // Draw axes
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding - 30);
  ctx.lineTo(width - padding, height - padding - 30);
  ctx.strokeStyle = '#ddd';
  ctx.stroke();
  
  // Draw labels
  ctx.font = '12px Arial';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  
  // X-axis labels
  const xStep = chartWidth / (data.labels.length - 1);
  data.labels.forEach((label, i) => {
    const x = padding + i * xStep;
    const y = height - padding - 10;
    ctx.fillText(label, x, y);
  });
  
  // Find max value for scaling
  const maxValue = Math.max(
    ...data.datasets.flatMap(dataset => dataset.data)
  );
  
  // Draw datasets
  data.datasets.forEach(dataset => {
    ctx.beginPath();
    
    dataset.data.forEach((value, i) => {
      const x = padding + i * xStep;
      const y = height - padding - 30 - (value / maxValue) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw points
    dataset.data.forEach((value, i) => {
      const x = padding + i * xStep;
      const y = height - padding - 30 - (value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = dataset.color;
      ctx.fill();
    });
  });
}

function drawLegend(
  ctx: CanvasRenderingContext2D,
  datasets: ChartProps['data']['datasets'],
  width: number,
  height: number
) {
  const legendY = height - 20;
  const itemWidth = width / datasets.length;
  
  datasets.forEach((dataset, i) => {
    const x = itemWidth * i + itemWidth / 2;
    
    // Draw color box
    ctx.fillStyle = dataset.color;
    ctx.fillRect(x - 40, legendY - 8, 16, 16);
    
    // Draw label
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.fillText(dataset.label, x - 20, legendY);
  });
}
