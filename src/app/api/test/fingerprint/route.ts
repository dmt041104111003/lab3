import { NextResponse } from 'next/server';
import { generateDeviceFingerprint } from '@/lib/device-fingerprint';

export const POST = async (req: Request) => {
  try {
    const { deviceData } = await req.json();
    
    if (!deviceData) {
      return NextResponse.json({
        success: false,
        error: 'Missing device data'
      });
    }

    const fingerprint = await generateDeviceFingerprint(deviceData.userAgent, deviceData);
    
    return NextResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        fingerprint: fingerprint,
        deviceData: deviceData,
        coreFields: {
          platform: deviceData.platform,
          hardwareConcurrency: deviceData.hardwareConcurrency,
          screenResolution: deviceData.screenResolution,
          colorDepth: deviceData.colorDepth,
          maxTouchPoints: deviceData.maxTouchPoints
        }
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
