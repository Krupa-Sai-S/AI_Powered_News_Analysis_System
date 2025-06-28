import React from 'react';
import { DailyDigest, Alert } from '../types';
import { MapPin, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface MapViewProps {
  digest: DailyDigest;
  alerts: Alert[];
}

export const MapView: React.FC<MapViewProps> = ({ digest, alerts }) => {
  // Mock coordinates for AP districts
  const districtCoordinates: Record<string, { lat: number; lng: number }> = {
    'Visakhapatnam': { lat: 17.7231, lng: 83.3012 },
    'Vijayawada': { lat: 16.5062, lng: 80.6480 },
    'Tirupati': { lat: 13.6288, lng: 79.4192 },
    'Kakinada': { lat: 16.9891, lng: 82.2475 },
    'Srikakulam': { lat: 18.2949, lng: 83.8938 },
    'Anakapalli': { lat: 17.6911, lng: 82.9988 },
    'Amalapuram': { lat: 16.5780, lng: 82.0050 },
    'Yellamanchilli': { lat: 17.5544, lng: 82.8578 },
    'Sompeta': { lat: 18.9487, lng: 84.5808 },
    'Kadapa': { lat: 14.4673, lng: 78.8242 },
    'Rajamahendravaram': { lat: 17.0005, lng: 81.7880 },
    'Bhimavaram': { lat: 16.5449, lng: 81.5212 }
  };

  const getDistrictActivity = (district: string) => {
    const clusterCount = digest.topicClusters.filter(cluster => 
      cluster.affectedDistricts.includes(district)
    ).length;
    
    const alertCount = alerts.filter(alert => 
      alert.districts.includes(district)
    ).length;

    return { clusters: clusterCount, alerts: alertCount };
  };

  const getActivityColor = (clusters: number, alerts: number) => {
    const total = clusters + alerts;
    if (total >= 5) return 'bg-red-500';
    if (total >= 3) return 'bg-yellow-500';
    if (total >= 1) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800">Andhra Pradesh - District Activity Map</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Activity (5+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Activity (3-4)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Low Activity (1-2)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Normal</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 min-h-[500px] border border-blue-200">
        {/* Simplified AP State Outline */}
        <svg
          viewBox="0 0 400 300"
          className="absolute inset-4 w-full h-full opacity-20"
          style={{ maxWidth: 'calc(100% - 2rem)', maxHeight: 'calc(100% - 2rem)' }}
        >
          <path
            d="M50 50 L350 50 L350 80 L320 120 L350 160 L350 200 L300 250 L200 250 L100 200 L50 150 Z"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>

        {/* District Markers */}
        <div className="relative h-full">
          {Object.entries(districtCoordinates).map(([district, coords]) => {
            const activity = getDistrictActivity(district);
            const total = activity.clusters + activity.alerts;
            
            // Convert lat/lng to relative positions (simplified)
            const x = ((coords.lng - 78) / (85 - 78)) * 80 + 10; // 10-90% range
            const y = ((19 - coords.lat) / (19 - 13)) * 80 + 10; // 10-90% range

            return (
              <div
                key={district}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {/* District Marker */}
                <div className={`w-6 h-6 rounded-full ${getActivityColor(activity.clusters, activity.alerts)} 
                  shadow-lg border-2 border-white cursor-pointer transition-all duration-200 
                  group-hover:scale-125 group-hover:shadow-xl`}>
                  {total > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs 
                      rounded-full flex items-center justify-center font-bold">
                      {total}
                    </div>
                  )}
                </div>

                {/* District Info Popup */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 min-w-[200px]">
                    <h4 className="font-bold text-slate-800 mb-2">{district}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Topic Clusters:</span>
                        <span className="font-semibold text-blue-600">{activity.clusters}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Active Alerts:</span>
                        <span className="font-semibold text-red-600">{activity.alerts}</span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-1 mt-2">
                        <span className="text-slate-600">Total Activity:</span>
                        <span className="font-bold text-slate-800">{total}</span>
                      </div>
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                    w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <h4 className="font-semibold text-slate-800 mb-2">Activity Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Total Districts:</span>
              <span className="font-semibold">{digest.districts.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Active Clusters:</span>
              <span className="font-semibold text-blue-600">{digest.topicClusters.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Active Alerts:</span>
              <span className="font-semibold text-red-600">{alerts.length}</span>
            </div>
          </div>
        </div>

        {/* High Activity Districts */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
          <h4 className="font-semibold text-slate-800 mb-2 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span>High Activity Districts</span>
          </h4>
          <div className="space-y-2">
            {digest.districts
              .map(district => ({
                name: district,
                activity: getDistrictActivity(district)
              }))
              .filter(d => (d.activity.clusters + d.activity.alerts) >= 3)
              .sort((a, b) => (b.activity.clusters + b.activity.alerts) - (a.activity.clusters + a.activity.alerts))
              .slice(0, 3)
              .map((district, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{district.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600 font-semibold">{district.activity.clusters}</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-red-600 font-semibold">{district.activity.alerts}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* District Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {digest.districts.slice(0, 12).map((district) => {
          const activity = getDistrictActivity(district);
          const total = activity.clusters + activity.alerts;
          
          return (
            <div key={district} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-800 text-sm">{district}</h4>
                <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.clusters, activity.alerts)}`}></div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Clusters:</span>
                  <span className="font-semibold text-blue-600">{activity.clusters}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Alerts:</span>
                  <span className="font-semibold text-red-600">{activity.alerts}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};