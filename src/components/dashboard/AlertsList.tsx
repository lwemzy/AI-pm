import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
interface Alert {
  id: number;
  type: string;
  doctor: string;
  details: string;
  severity: string;
  date: string;
}
interface AlertsListProps {
  alerts: Alert[];
}
export function AlertsList({
  alerts
}: AlertsListProps) {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  return <div className="space-y-4">
      {alerts.length === 0 ? <p className="text-gray-500 text-center py-4">No alerts to display</p> : alerts.map(alert => <div key={alert.id} className="border-l-4 border-red-500 bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between">
              <div className="flex items-center">
                <AlertCircleIcon size={16} className="text-red-500 mr-2" />
                <span className="font-medium text-gray-900">{alert.type}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getSeverityStyles(alert.severity)}`}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{alert.details}</p>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{alert.doctor}</span>
              <span>{formatDate(alert.date)}</span>
            </div>
          </div>)}
      {alerts.length > 0 && <div className="pt-2">
          <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
            View all alerts →
          </button>
        </div>}
    </div>;
}