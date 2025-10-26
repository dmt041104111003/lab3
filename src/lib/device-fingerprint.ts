export async function generateDeviceFingerprint(userAgent: string, deviceData: any): Promise<string> {
  const fingerprintData = {
    canvasFingerprint: deviceData.canvasFingerprint || '',
    colorDepth: deviceData.colorDepth,
    cookieEnabled: deviceData.cookieEnabled,
    doNotTrack: deviceData.doNotTrack,
    hardwareConcurrency: deviceData.hardwareConcurrency,
    language: deviceData.language,
    maxTouchPoints: deviceData.maxTouchPoints,
    pixelRatio: deviceData.pixelRatio,
    platform: deviceData.platform,
    screenResolution: deviceData.screenResolution,
    timezone: deviceData.timezone,
    userAgent: userAgent
  }

  const fingerprintString = JSON.stringify(fingerprintData)
  
  const encoder = new TextEncoder()
  const data = encoder.encode(fingerprintString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}
