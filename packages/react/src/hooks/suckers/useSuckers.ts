import { debug, SuckerPair } from "juice-sdk-core";
import { useJBChainId } from "../../contexts/JBChainContext/JBChainContext";
import { useQuery, UseQueryReturnType } from "wagmi/query";
import { useJBContractContext } from "../../contexts/JBContractContext/JBContractContext";

/**
 * Return sucker pairs for the project ID in context.
 *
 * Hits JBM endpoint, heavily cached
 * @returns
 */
export function useSuckers(): UseQueryReturnType<SuckerPair[] | null> {
  const { projectId } = useJBContractContext();
  const chainId = useJBChainId();

  debug("useSuckers::args", {
    projectId,
    chainId,
  });

  return useQuery({
    queryKey: [
      "juice-sdk",
      "suckers",
      projectId.toString(),
      chainId?.toString(),
    ],
    staleTime: Infinity,
    enabled: !!chainId,
    queryFn: async () => {
      if (!chainId) {
        return null;
      }

      const suckersData = await fetch(
        `https://sepolia.juicebox.money/api/juicebox/v4/project/${projectId}/sucker-pairs?chainId=${chainId}`
      ).then((res) => res.json());

      return suckersData.suckers as SuckerPair[];
    },
  });
}
