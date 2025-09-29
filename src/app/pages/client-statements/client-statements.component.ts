import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-client-statements',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ChartModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule
  ],
  template: `
    <div class="client-statements-dashboard">
      <div class="header">
        <h2>Statement Dashboard - Client {{clientId}}</h2>
        <p class="subtitle">Analysis of uploaded bank statements and categorized transactions</p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-container">
        <p-progressSpinner></p-progressSpinner>
        <p>Loading statement analysis...</p>
      </div>

      <!-- Error State -->
      <p-message *ngIf="error && !loading" severity="error" [text]="error"></p-message>

      <!-- Demo Dashboard -->
      <div *ngIf="!loading && !error" class="dashboard-content">
        
        <!-- Summary Cards -->
        <div class="summary-cards">
          <p-card header="Total Statements">
            <div class="summary-value">{{statementCount}}</div>
          </p-card>
          
          <p-card header="Total Money In">
            <div class="summary-value positive">R {{totalMoneyIn | number:'1.2-2'}}</div>
          </p-card>
          
          <p-card header="Total Money Out">
            <div class="summary-value negative">R {{totalMoneyOut | number:'1.2-2'}}</div>
          </p-card>
          
          <p-card header="Net Amount">
            <div class="summary-value" [class]="netAmount >= 0 ? 'positive' : 'negative'">
              R {{netAmount | number:'1.2-2'}}
            </div>
          </p-card>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <p-card header="Spending by Category">
            <p-chart type="doughnut" 
                     [data]="categoryChartData" 
                     [options]="chartOptions">
            </p-chart>
          </p-card>

          <p-card header="Money Flow Over Time">
            <p-chart type="line" 
                     [data]="flowChartData" 
                     [options]="lineChartOptions">
            </p-chart>
          </p-card>
        </div>

        <!-- Recent Activity -->
        <p-card header="Recent Statements">
          <div class="statement-list">
            <div *ngFor="let statement of sampleStatements" class="statement-item">
              <div class="statement-info">
                <h4>{{statement.name}}</h4>
                <p>{{statement.date | date:'short'}}</p>
              </div>
              <div class="statement-stats">
                <p-tag [value]="statement.status" 
                       [severity]="getStatusSeverity(statement.status)">
                </p-tag>
                <div class="amount" [class]="statement.amount >= 0 ? 'positive' : 'negative'">
                  R {{statement.amount | number:'1.2-2'}}
                </div>
              </div>
            </div>
          </div>
        </p-card>

        <p-card header="Next Steps">
          <div class="next-steps">
            <p>✅ Statements uploaded successfully</p>
            <p>🔄 Processing transactions and categorizing spending</p>
            <p>📊 ML analysis will show more detailed insights as more data is uploaded</p>
            <p>💡 Upload more statements to see better categorization and trends</p>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .client-statements-dashboard {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h2 {
      color: #1f2937;
      margin-bottom: 5px;
    }

    .subtitle {
      color: #6b7280;
      margin: 0;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .summary-value {
      font-size: 2rem;
      font-weight: bold;
      margin-top: 10px;
    }

    .positive {
      color: #10b981;
    }

    .negative {
      color: #ef4444;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .charts-section {
        grid-template-columns: 1fr;
      }
      
      .summary-cards {
        grid-template-columns: 1fr 1fr;
      }
    }

    p-card {
      margin-bottom: 20px;
    }

    .statement-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .statement-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .statement-info h4 {
      margin: 0 0 5px 0;
      color: #1f2937;
    }

    .statement-info p {
      margin: 0;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .statement-stats {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .amount {
      font-weight: bold;
      font-size: 1.1rem;
    }

    .next-steps {
      line-height: 1.8;
    }

    .next-steps p {
      margin: 10px 0;
      font-size: 1.1rem;
    }
  `]
})
export class ClientStatementsComponent implements OnInit {
  clientId!: number;
  loading = true;
  error: string | null = null;

  // Demo data for now
  statementCount = 2;
  totalMoneyIn = 15420.50;
  totalMoneyOut = 12350.75;
  netAmount = 3069.75;

  sampleStatements = [
    {
      name: 'FNB Statement (v2).pdf',
      date: new Date(),
      status: 'completed',
      amount: 1200.50
    },
    {
      name: 'FNB Statement.pdf',
      date: new Date(Date.now() - 86400000),
      status: 'completed',
      amount: -850.25
    }
  ];

  categoryChartData: any;
  flowChartData: any;
  chartOptions: any;
  lineChartOptions: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.setupCharts();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.clientId = +params['id'];
      this.loadData();
    });
  }

  loadData() {
    // Simulate loading
    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'uploaded': return 'warn';
      case 'failed': return 'danger';
      default: return 'info';
    }
  }

  setupCharts() {
    this.categoryChartData = {
      labels: ['Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Other'],
      datasets: [
        {
          data: [2500, 800, 1200, 3500, 600, 900],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }
      ]
    };

    this.flowChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Money In',
          data: [2500, 2800, 2200, 3200, 2900, 3100],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Money Out',
          data: [1800, 2100, 1900, 2400, 2200, 2300],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    };

    this.lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    };
  }
}