export function clear0GCache(walletAddress: string, providerAddress?: string) {
  if (typeof window !== "undefined") {
    // 0g_cache_nonce
    window.localStorage.removeItem(`0g_cache_nonce`);

    // 0g_metadata_0xABCD...DA27_settleSignerPrivateKey
    window.localStorage.removeItem(
      `0g_metadata_${walletAddress}_settleSignerPrivateKey`
    );

    if (providerAddress) {
      // 0g_cache_0xABCD...DA27_0x4878...b9aa_ack
      window.localStorage.removeItem(
        `0g_cache_${walletAddress}_${providerAddress}_ack`
      );

      // 0g_cache_service_0x4878...b9aa
      window.localStorage.removeItem(`0g_cache_service_${providerAddress}`);
    }
  }
}
