import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-single-month-graph',
  imports: [ChartModule],
  templateUrl: './single-month-graph.component.html',
  styleUrl: './single-month-graph.component.scss'
})
export class SingleMonthGraphComponent {
  chartData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Money In',
        data: [1200, 1500, 900, 500, 2000, 1800, 1600, 1400, 1300, 1700, 1900, 2100],
        backgroundColor: '#42A5F5'
      },
      {
        label: 'Money out',
        data: [1200, 1500, 900,200, 2000, 180, 1700, 1400, 1370, 1700, 1900, 2190],
        backgroundColor: '#42A5F5'
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };
}
