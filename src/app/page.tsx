'use client';

import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useEffect, useState } from 'react';

const devnetConnection = new Connection(clusterApiUrl('devnet'));
const testnetConnection = new Connection(clusterApiUrl('testnet'));
const mainnetConnection = new Connection('https://api.quicknode.com/solana');

interface NetworkInfo {
  slotNumber: number | null;
  blockTime: string | null;
  status: 'loading' | 'connected' | 'error';
  errorMessage?: string;
}

export default function Home() {
  const [devnetInfo, setDevnetInfo] = useState<NetworkInfo>({
    slotNumber: null,
    blockTime: null,
    status: 'loading'
  });
  const [testnetInfo, setTestnetInfo] = useState<NetworkInfo>({
    slotNumber: null,
    blockTime: null,
    status: 'loading'
  });
  const [mainnetInfo, setMainnetInfo] = useState<NetworkInfo>({
    slotNumber: null,
    blockTime: null,
    status: 'loading'
  });

  useEffect(() => {
    const fetchNetworkInfo = async (connection: Connection, setInfo: (info: NetworkInfo) => void) => {
      try {
        await connection.getVersion();
        const slot = await connection.getSlot();
        const time = await connection.getBlockTime(slot);
        
        setInfo({
          slotNumber: slot,
          blockTime: time ? new Date(time * 1000).toLocaleString() : null,
          status: 'connected'
        });
      } catch (error) {
        console.error('Error fetching Solana info:', error);
        setInfo({
          slotNumber: null,
          blockTime: null,
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Failed to connect to network'
        });
      }
    };

    const updateNetworks = () => {
      // Update each network independently
      fetchNetworkInfo(devnetConnection, setDevnetInfo);
      fetchNetworkInfo(testnetConnection, setTestnetInfo);
      fetchNetworkInfo(mainnetConnection, setMainnetInfo);
    };

    updateNetworks();
    const interval = setInterval(updateNetworks, 10000);

    return () => clearInterval(interval);
  }, []);

  const NetworkCard = ({ title, info }: { title: string, info: NetworkInfo }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>
      <div className="space-y-2 text-gray-300">
        <p className="flex items-center gap-2">
          Status: 
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
            info.status === 'connected' ? 'bg-green-500/20 text-green-400' :
            info.status === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {info.status === 'connected' ? '● Connected' :
             info.status === 'error' ? '● Error' :
             '● Connecting...'}
          </span>
        </p>
        {info.status === 'error' ? (
          <p className="text-red-400">{info.errorMessage}</p>
        ) : (
          <>
            <p>Current Slot: {info.slotNumber ?? 'Loading...'}</p>
            <p>Block Time: {info.blockTime ?? 'Loading...'}</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">
        Does windsurf slap???
      </h1>
      
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-center">
        <NetworkCard title="Solana Devnet Info" info={devnetInfo} />
        <NetworkCard title="Solana Testnet Info" info={testnetInfo} />
        <NetworkCard title="Solana Mainnet Info" info={mainnetInfo} />
      </div>
    </main>
  );
}
