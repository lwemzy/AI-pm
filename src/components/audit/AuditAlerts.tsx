import React from 'react';
import { AlertCircleIcon, AlertTriangleIcon, InfoIcon } from 'lucide-react';
import { useData } from '../context/DataContext';

export function AuditAlerts() {
  const { processedData } = useData();
  const audit = processedData.auditMetrics;
  const pbm = processedData.pbmMetrics;

  if (!audit) return null;

  const alerts: { severity: 'high' | 'medium' | 'info'; title: string; detail: string }[] = [];

  // Overcharge alerts
  if (audit.overchargeCount > 0) {
    alerts.push({
      severity: 'high',
      title: `${audit.overchargeCount} overcharged claims detected`,
      detail: `Total overcharge amount: $${audit.totalOverchargeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}. These claims exceeded contracted rates by more than 2% tolerance.`
    });
  }

  // GER variance alerts
  Object.keys(audit.gerVarianceByPBM).forEach(pbmId => {
    const variance = audit.gerVarianceByPBM[pbmId];
    if (variance > 2) {
      alerts.push({
        severity: 'high',
        title: `PBM ${pbmId} missed GER guarantee`,
        detail: `Actual GER is ${variance.toFixed(1)}% higher than guaranteed rate. This indicates the PBM is not meeting its generic pricing commitments.`
      });
    }
  });

  // BER variance alerts
  Object.keys(audit.berVarianceByPBM).forEach(pbmId => {
    const variance = audit.berVarianceByPBM[pbmId];
    if (variance > 2) {
      alerts.push({
        severity: 'medium',
        title: `PBM ${pbmId} missed BER guarantee`,
        detail: `Actual BER is ${variance.toFixed(1)}% higher than guaranteed rate.`
      });
    }
  });

  // Compliance rate alert
  if (audit.complianceRate < 95) {
    alerts.push({
      severity: audit.complianceRate < 85 ? 'high' : 'medium',
      title: `Overall compliance rate below threshold: ${audit.complianceRate.toFixed(1)}%`,
      detail: `${audit.totalAuditableRecords - audit.overchargeCount - audit.underchargeCount} of ${audit.totalAuditableRecords} auditable claims are within contracted rate tolerance.`
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      severity: 'info',
      title: 'No audit issues detected',
      detail: 'All auditable claims are within contracted rate tolerances.'
    });
  }

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangleIcon className="h-5 w-5 text-amber-500" />;
      default: return <InfoIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBg = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Audit Alerts</h2>
      </div>
      <div className="p-6 space-y-4">
        {alerts.map((alert, i) => (
          <div key={i} className={`p-4 rounded-lg border ${getBg(alert.severity)}`}>
            <div className="flex items-start">
              {getIcon(alert.severity)}
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">{alert.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{alert.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
