// speedtest.js
// Node.js >= 12 recommended
const speedTest = require('speedtest-net');

function toMbps(bw) {
  // speedtest-net returns bandwidth in bytes/sec.
  // 1 Mbps = 125000 bytes/sec
  return (bw / 125000).toFixed(2);
}

(async () => {
  try {
    console.log('Starting speed test — this may take 10–30s...');
    // acceptLicense / acceptGdpr required by many speedtest libs
    const result = await speedTest({ acceptLicense: true, acceptGdpr: true });

    // Basic human-friendly output
    console.log('--- Speedtest Result ---');
    console.log(`Timestamp : ${new Date(result.timestamp || Date.now()).toISOString()}`);
    if (result.server) {
      console.log(`Server    : ${result.server.name} (${result.server.location}, ${result.server.country})`);
      console.log(`Host      : ${result.server.host}`);
      console.log(`Distance  : ${result.server.distance ? result.server.distance.toFixed(1) + ' km' : 'N/A'}`);
    }
    console.log(`Ping      : ${result.ping.latency != null ? result.ping.latency + ' ms' : (result.ping + ' ms')}`);
    // download/upload bandwidth fields
    const downloadBw = result.download && result.download.bandwidth ? result.download.bandwidth : (result.download || 0);
    const uploadBw   = result.upload   && result.upload.bandwidth   ? result.upload.bandwidth   : (result.upload   || 0);
    console.log(`Download  : ${toMbps(downloadBw)} Mbps (${downloadBw} B/s raw)`);
    console.log(`Upload    : ${toMbps(uploadBw)} Mbps (${uploadBw} B/s raw)`);
    if (result.packetLoss != null) console.log(`PacketLoss: ${result.packetLoss}%`);
    if (result.jitter != null) console.log(`Jitter    : ${result.ping && result.ping.jitter ? result.ping.jitter + ' ms' : (result.jitter ? result.jitter + ' ms' : 'N/A')}`);
    console.log('Full JSON result available if you need more details.');
  } catch (err) {
    console.error('Speedtest failed:', err.message || err);
  }
})();
