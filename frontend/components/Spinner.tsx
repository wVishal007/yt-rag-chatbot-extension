import React, { FC } from 'react';

const Spinner: FC = () => (
  <div className="flex justify-center items-center py-4">
    <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
  </div>
);

export default Spinner;