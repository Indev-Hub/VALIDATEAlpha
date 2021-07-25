import React from 'react'
import Enumerable from 'linq';
import Json from './others/Json';

const AnalyticsValidations = () => {

  const jsonObj = require('./KickstarterTrimmed.json')

  const result = Enumerable.from(jsonObj)
  .groupBy(g => g.data.category.parent_name)
  .select(s => ({
    id: s.key(),
    // max: s.max(m => m.cost),
    // min: s.min(m => m.cost),
    // avg: s.average(m => m.cost),
    count: s.count(),
    // sum: s.sum(s => s.cost)
  }))
  .toArray();

  return (
    <div>
      
    </div>
  )
}

export default AnalyticsValidations
