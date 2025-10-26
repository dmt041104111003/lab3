export async function generateDeviceFingerprint(userAgent: string, deviceData: any): Promise<string> {
  const coreFingerprint = {
    platform: deviceData.platform || 'unknown',
    hardwareConcurrency: deviceData.hardwareConcurrency || 0,
    screenResolution: deviceData.screenResolution || 'unknown',
    colorDepth: deviceData.colorDepth || 0,
    maxTouchPoints: deviceData.maxTouchPoints || 0,
  };

  const fingerprintString = `p:${coreFingerprint.platform}|hc:${coreFingerprint.hardwareConcurrency}|sr:${coreFingerprint.screenResolution}|cd:${coreFingerprint.colorDepth}|mt:${coreFingerprint.maxTouchPoints}`;
  
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    return Math.abs(hash).toString(16);
  }
}
