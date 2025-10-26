export async function generateDeviceFingerprint(userAgent: string, deviceData: any): Promise<string> {
  const fingerprintData = {
    userAgent: userAgent,
    language: deviceData.language,
    platform: deviceData.platform,
    screenResolution: deviceData.screenResolution,
    timezone: deviceData.timezone,
    cookieEnabled: deviceData.cookieEnabled,
    doNotTrack: deviceData.doNotTrack,
    hardwareConcurrency: deviceData.hardwareConcurrency,
    maxTouchPoints: deviceData.maxTouchPoints,
    colorDepth: deviceData.colorDepth,
    pixelRatio: deviceData.pixelRatio,
    canvasFingerprint: deviceData.canvasFingerprint || ''
  }

  const fingerprintString = JSON.stringify(fingerprintData)
  
  const encoder = new TextEncoder()
  const data = encoder.encode(fingerprintString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  return hashHex
}
