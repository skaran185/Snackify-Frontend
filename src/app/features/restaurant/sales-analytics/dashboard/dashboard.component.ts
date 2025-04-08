import { Component, OnInit } from '@angular/core';
import { DashBoardService } from 'src/app/core/services/dashboard.service';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';

// Register all the necessary components for Chart.js (line, bar, pie, etc.)
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  selectedFilter: string = 'AllTime';
  dateFilterType: string = 'single';
  singleDate: string = moment().format();
  startDate: string = moment().subtract(7, 'days').format();
  endDate: string = moment().format();
  activeFilterLabel: string = 'All Time';

  salesPerformanceChart!: Chart;
  orderStatusChart!: Chart;
  topSellingItemsChart!: Chart;
  revenueOverTimeChart!: Chart;
  // selectedFilter: string = 'Today';
  dashboardData: any;

  constructor(private apiService: DashBoardService) { }

  ngOnInit() {
    setTimeout(() => {
      this.loadDashboardData();
    }, 100);
  }

  applyFilters() {
    this.loadDashboardData();
  }

  validateDateRange() {
    if (moment(this.endDate).isBefore(this.startDate)) {
      this.endDate = this.startDate;
    }
  }

  // Apply custom date filter
  applyCustomFilter() {
    let startDate, endDate;

    if (this.dateFilterType === 'single') {
      const selected = moment(this.singleDate);
      startDate = selected.clone().startOf('day');
      endDate = selected.clone().endOf('day');
      this.activeFilterLabel = `Date: ${selected.format('DD MMM YYYY')}`;
    } else {
      startDate = moment(this.startDate).startOf('day');
      endDate = moment(this.endDate).endOf('day');
      this.activeFilterLabel = `From: ${startDate.format('DD MMM YYYY')} To: ${endDate.format('DD MMM YYYY')}`;
    }

    this.loadDashboardData(startDate, endDate);
  }

  resetDateSelections() {
    if (this.dateFilterType === 'single') {
      this.singleDate = moment().format();
    } else {
      this.startDate = moment().subtract(7, 'days').format();
      this.endDate = moment().format();
    }
  }

  applyPresetFilter() {
    if (this.selectedFilter === 'Custom') {
      return;
    }

    let startDate, endDate;
    const now = moment();

    switch (this.selectedFilter) {
      case 'Today':
        startDate = now.clone().startOf('day');
        endDate = now.clone().endOf('day');
        this.activeFilterLabel = 'Today';
        break;

      case 'LastWeek':
        startDate = now.clone().subtract(1, 'week').startOf('day');
        endDate = now.clone().endOf('day');
        this.activeFilterLabel = 'Last 7 Days';
        break;

      case 'LastMonth':
        startDate = now.clone().subtract(1, 'month').startOf('day');
        endDate = now.clone().endOf('day');
        this.activeFilterLabel = 'Last 30 Days';
        break;

      case 'LastYear':
        startDate = now.clone().subtract(1, 'year').startOf('day');
        endDate = now.clone().endOf('day');
        this.activeFilterLabel = 'Last Year';
        break;

      default: // AllTime
        startDate = null;
        endDate = null;
        this.activeFilterLabel = 'All Time';
        break;
    }

    this.loadDashboardData(startDate, endDate);
  }

  clearFilters() {
    this.selectedFilter = 'AllTime';
    this.activeFilterLabel = 'All Time';
    this.loadDashboardData();
  }

  loadDashboardData(startDate: any = '', endDate: any = '') {
    // Call API to get filtered data
    this.apiService.getDashboardData(this.selectedFilter, startDate, endDate).subscribe((data: any) => {
      this.dashboardData = data;
      this.initCharts();
    });
  }

  initCharts() {
    this.initSalesPerformanceChart();
    this.initOrderStatusChart();
    this.initTopSellingItemsChart();
    this.initRevenueOverTimeChart();
  }

  initSalesPerformanceChart() {
    if (this.salesPerformanceChart) {
      this.salesPerformanceChart.destroy();
    }
    this.salesPerformanceChart = new Chart('salesPerformanceChart', {
      type: 'bar',
      data: {
        labels: this.dashboardData.salesPerformance.dates,
        datasets: [{
          label: 'Sales',
          data: this.dashboardData.salesPerformance.sales,
          backgroundColor: ['#ff6384', '#36a2eb']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initOrderStatusChart() {
    if (this.orderStatusChart) {
      this.orderStatusChart.destroy();
    }
    this.orderStatusChart = new Chart('orderStatusChart', {
      type: 'pie',
      data: {
        labels: this.dashboardData.orderStatus.labels,
        datasets: [{
          data: this.dashboardData.orderStatus.values,
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff9f40']
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  initTopSellingItemsChart() {
    if (this.topSellingItemsChart) {
      this.topSellingItemsChart.destroy();
    }
    this.topSellingItemsChart = new Chart('topSellingItemsChart', {
      type: 'bar',
      data: {
        labels: this.dashboardData.topSellingItems.names,
        datasets: [{
          label: 'Sales',
          data: this.dashboardData.topSellingItems.sales,
          backgroundColor: ['#4bc0c0']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initRevenueOverTimeChart() {
    if (this.revenueOverTimeChart) {
      this.revenueOverTimeChart.destroy();
    }
    this.revenueOverTimeChart = new Chart('revenueOverTimeChart', {
      type: 'line',
      data: {
        labels: this.dashboardData.revenueOverTime.dates,
        datasets: [{
          label: 'Revenue',
          data: this.dashboardData.revenueOverTime.revenue,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
