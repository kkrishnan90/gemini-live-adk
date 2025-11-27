import React from 'react';
import { Plane, Calendar, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FlightCard = ({ flight }) => {
  if (!flight) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-white shadow-xl max-w-md w-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-bold">{flight.airline}</h3>
          <p className="text-white/60 text-sm">{flight.flight}</p>
        </div>
        <div className="bg-blue-500/20 p-2 rounded-full">
          <Plane className="w-6 h-6 text-blue-400" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span className="text-xl font-semibold">${flight.price}</span>
          <span className="text-sm text-white/50">per person</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-purple-400" />
          <span>{flight.seats} seats remaining</span>
        </div>
      </div>
      
      <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors">
        Book Now
      </button>
    </motion.div>
  );
};

export default FlightCard;
