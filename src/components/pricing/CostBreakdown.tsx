import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';

export function CostBreakdown() {
    const { prescriptions } = useData();

    const costData = React.useMemo(() => {
        const groups: { [drug: string]: { awp: number; ingredient: number; dispensing: number; planPaid: number; patientPaid: number; count: number } } = {};

        prescriptions.forEach(rx => {
            if (rx.AWP_Unit_Cost == null && rx.Ingredient_Cost == null) return;
            const key = rx.Drug_Class;
            if (!groups[key]) groups[key] = { awp: 0, ingredient: 0, dispensing: 0, planPaid: 0, patientPaid: 0, count: 0 };
            groups[key].awp += (rx.AWP_Unit_Cost || 0) * (rx.Quantity || 1);
            groups[key].ingredient += rx.Ingredient_Cost || 0;
            groups[key].dispensing += rx.Dispensing_Fee || 0;
            groups[key].planPaid += rx.Plan_Paid_Amount || 0;
            groups[key].patientPaid += rx.Patient_Paid_Amount || 0;
            groups[key].count++;
        });

        return Object.entries(groups)
            .map(([name, data]) => ({
                name,
                'AWP': data.awp / data.count,
                'Ingredient Cost': data.ingredient / data.count,
                'Dispensing Fee': data.dispensing / data.count,
                'Plan Paid': data.planPaid / data.count,
                'Patient Paid': data.patientPaid / data.count,
            }))
            .sort((a, b) => b['AWP'] - a['AWP'])
            .slice(0, 10);
    }, [prescriptions]);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Cost Breakdown by Drug Class</h2>
                <p className="mt-1 text-sm text-gray-500">Average cost components per claim</p>
            </div>
            <div className="p-6">
                {costData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={costData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(v) => `$${v.toFixed(0)}`} />
                            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="AWP" stackId="a" fill="#94a3b8" name="AWP" />
                            <Bar dataKey="Ingredient Cost" stackId="a" fill="#3b82f6" name="Ingredient Cost" />
                            <Bar dataKey="Dispensing Fee" stackId="a" fill="#f59e0b" name="Dispensing Fee" />
                            <Bar dataKey="Plan Paid" fill="#10b981" name="Plan Paid" />
                            <Bar dataKey="Patient Paid" fill="#ef4444" name="Patient Paid" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center text-gray-500 py-8">No cost data available.</p>
                )}
            </div>
        </div>
    );
}
