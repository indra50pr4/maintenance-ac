/**
 * AC Maintenance System - Charts Module
 */
const ChartManager = {
  statusChart: null,
  serviceTypeChart: null,
  monthlyChart: null,

  initOrUpdate(units, history) {
    this.renderStatusChart(units);
    this.renderServiceTypeChart(history);
    this.renderMonthlyChart(history);
  },

  renderStatusChart(units) {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const counts = {
      Normal: 0,
      'Due Soon': 0,
      Overdue: 0,
      'Under Repair': 0
    };

    units.forEach(u => {
      const status = u.status || 'Normal';
      if (counts[status] !== undefined) {
        counts[status]++;
      } else {
        counts['Normal']++;
      }
    });

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#475569';

    this.statusChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Normal / Good', 'Due Soon', 'Overdue', 'Under Repair'],
        datasets: [{
          data: [counts.Normal, counts['Due Soon'], counts.Overdue, counts['Under Repair']],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
          borderWidth: 2,
          borderColor: isDark ? '#1e293b' : '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 14,
              color: textColor,
              font: { size: 12, family: 'system-ui' }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw || 0;
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${val} unit (${pct}%)`;
              }
            }
          }
        },
        cutout: '68%'
      }
    });
  },

  renderServiceTypeChart(history) {
    const canvas = document.getElementById('serviceTypeChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const counts = {
      'Routine Cleaning': 0,
      'Freon Refill': 0,
      'Electrical / Parts': 0,
      'Major Repair': 0
    };

    history.forEach(h => {
      const type = h.serviceType || 'Routine Cleaning';
      if (counts[type] !== undefined) {
        counts[type]++;
      } else {
        counts['Routine Cleaning']++;
      }
    });

    if (this.serviceTypeChart) {
      this.serviceTypeChart.destroy();
    }

    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#475569';

    this.serviceTypeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cuci / Routine', 'Freon', 'Electrical', 'Repair'],
        datasets: [{
          label: 'Total Service',
          data: [
            counts['Routine Cleaning'],
            counts['Freon Refill'],
            counts['Electrical / Parts'],
            counts['Major Repair']
          ],
          backgroundColor: ['#06b6d4', '#3b82f6', '#f59e0b', '#ec4899'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { size: 11 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, stepSize: 1, precision: 0 },
            grid: { color: isDark ? '#334155' : '#f1f5f9' }
          }
        }
      }
    });
  },

  renderMonthlyChart(history) {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Group last 6 months
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const months = [];
    const counts = [];
    const costTotals = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        key: key,
        label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      });
      counts.push(0);
      costTotals.push(0);
    }

    history.forEach(item => {
      if (!item.date) return;
      const itemDate = new Date(item.date);
      const itemKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`;
      const idx = months.findIndex(m => m.key === itemKey);
      if (idx !== -1) {
        counts[idx]++;
        costTotals[idx] += Number(item.cost || 0);
      }
    });

    if (this.monthlyChart) {
      this.monthlyChart.destroy();
    }

    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#e2e8f0' : '#475569';

    this.monthlyChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: months.map(m => m.label),
        datasets: [{
          label: 'Service Count',
          data: counts,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#2563eb',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { size: 11 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, precision: 0 },
            grid: { color: isDark ? '#334155' : '#f1f5f9' }
          }
        }
      }
    });
  }
};
