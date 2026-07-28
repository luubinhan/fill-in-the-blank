import React from 'react';
import Lottie from 'lottie-react';
import loadingData from '../../icons/loading.json';

const LoadingLottie: React.FC = () => (
  <div className="min-h-dvh flex flex-1 flex-col items-center justify-center bg-black">
    <div className="w-32 h-32">
      <Lottie animationData={loadingData} loop />
    </div>
  </div>
);

export default LoadingLottie;
