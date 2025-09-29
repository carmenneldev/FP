import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ClientStateService } from '../../services/client-state.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-statement-graph',
  standalone: true,
  imports: [ChartModule, NgIf],
  templateUrl: './statement-graph.component.html',
  styleUrl: './statement-graph.component.scss'
})
export class StatementGraphComponent implements OnChanges {
  @Input() selectedPeriod: string = '12';
  @Input() showOnlyNetFlow: boolean = false;
  @Input() showAUMChart: boolean = true;
  @Input() showMoneyInOut: boolean = false;

  @Output() netFlowsChange = new EventEmitter<{ label: string; value: number }[]>();

  constructor(private clientState: ClientStateService) {}

  fullData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    moneyIn: [1200, 1500, 900, 500, 2000, 1800, 1600, 1400, 1300, 1700, 1900, 2100],
    moneyOut: [1200, 1500, 900, 200, 2000, 180, 1700, 1400, 1370, 1700, 1900, 2190]
  };

  aumChartData: any;
  netFlowChartData: any;
  aumChartOptions: any;
  netFlowChartOptions: any;

  ngOnInit() {
    this.clientState.bankData$.subscribe(data => {
      if (data) {
        this.fullData = data;
        this.updateChartData();
      }
    });

    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPeriod']) {
      this.updateChartData();
    }
  }

  updateChartData() {
    const months = parseInt(this.selectedPeriod, 10);
    const start = 12 - months;

    const labels = this.fullData.labels.slice(start);
    const moneyIn = this.fullData.moneyIn.slice(start);
    const moneyOut = this.fullData.moneyOut.slice(start);

    const net = moneyIn.map((inVal, i) => inVal - moneyOut[i]);
    const cumulative = net.reduce((acc, curr, i) => {
      acc.push((acc[i - 1] || 0) + curr);
      return acc;
    }, [] as number[]);

    // Emit net flow data
    this.netFlowsChange.emit(
      labels.map((label, i) => ({ label, value: net[i] }))
    );

    // Money In / Out Chart
    if (this.showMoneyInOut) {
      this.netFlowChartData = {
        labels,
        datasets: [
          {
            label: 'Money In',
            data: moneyIn,
            backgroundColor: '#42A5F5'
          },
          {
            label: 'Money Out',
            data: moneyOut,
            backgroundColor: '#ef5350'
          }
        ]
      };

      this.netFlowChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            grid: { display: true }
          },
          y: {
            beginAtZero: true,
            grid: { display: true }
          }
        }
      };

      return; 
    }

    //  AUM Line Chart
    this.aumChartData = {
      labels,
      datasets: [
        {
          label: 'AUM',
          data: cumulative,
          fill: true,
          borderColor: '#A20084',
          backgroundColor: 'rgba(162, 0, 132, 0.1)',
          tension: 0.4,
          pointBackgroundColor: '#A20084'
        }
      ]
    };

    this.aumChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `R ${ctx.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          ticks: { display: false },
          grid: {
            display: true,
            color: '#f98ee6ff'
          },
          border: { display: false }
        }
      }
    };

    // Net Flow Bar Chart
    this.netFlowChartData = {
      labels,
      datasets: [
        {
          label: 'Net Flow',
          data: net,
          backgroundColor: net.map(val => val >= 0 ? '#A20084' : '#f44336'),
          borderRadius: 6,
          barPercentage: 0.6
        }
      ]
    };

    this.netFlowChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { display: false },
        y: {
          beginAtZero: true,
          min: 0,
          ticks: { stepSize: 200 },
          grid: {
            display: true,
            color: '#f98ee6ff'
          }
        }
      }
    };
  }
}
